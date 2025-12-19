import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface GameMove {
    from: string
    to: string
    promotion?: string
    fen: string
    timestamp: number
}

export interface TimeUpdate {
    whiteTime: number
    blackTime: number
    lastUpdate: number
}

export interface GamePresence {
    userId: string
    status: 'online' | 'offline'
}

export class RealtimeService {
    private supabase = createClient()
    private channels: Map<string, RealtimeChannel> = new Map()

    // Subscribe to game moves
    subscribeToGame(
        gameId: string,
        onMove: (move: GameMove) => void,
        onTimeUpdate: (time: TimeUpdate) => void,
        onPresence: (presence: GamePresence[]) => void
    ): () => void {
        const channelName = `game:${gameId}`

        // Remove existing channel if any
        if (this.channels.has(channelName)) {
            this.unsubscribe(channelName)
        }

        const channel = this.supabase
            .channel(channelName, {
                config: {
                    broadcast: { ack: true },
                    presence: { key: gameId },
                },
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'game_moves',
                filter: `game_id=eq.${gameId}`,
            }, (payload) => {
                const newMove = payload.new
                onMove({
                    from: newMove.from_square,
                    to: newMove.to_square,
                    promotion: newMove.promotion,
                    fen: newMove.fen_after,
                    timestamp: new Date(newMove.timestamp).getTime(),
                })
            })
            .on('broadcast', { event: 'time' }, ({ payload }) => {
                onTimeUpdate(payload as TimeUpdate)
            })
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const presenceList = Object.values(state).flat() as unknown as GamePresence[]
                onPresence(presenceList)
            })
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log('Successfully subscribed to game channel')
                }
            })

        this.channels.set(channelName, channel)

        // Return cleanup function
        return () => this.unsubscribe(channelName)
    }

    // Broadcast a move
    async broadcastMove(gameId: string, move: GameMove): Promise<void> {
        const channelName = `game:${gameId}`
        const channel = this.channels.get(channelName)

        if (!channel) {
            console.error('Channel not found for game:', gameId)
            return
        }

        await channel.send({
            type: 'broadcast',
            event: 'move',
            payload: move,
        })
    }

    // Broadcast time update
    async broadcastTimeUpdate(gameId: string, time: TimeUpdate): Promise<void> {
        const channelName = `game:${gameId}`
        const channel = this.channels.get(channelName)

        if (!channel) {
            console.error('Channel not found for game:', gameId)
            return
        }

        await channel.send({
            type: 'broadcast',
            event: 'time',
            payload: time,
        })
    }

    // Track presence
    async trackPresence(gameId: string, userId: string): Promise<void> {
        const channelName = `game:${gameId}`
        const channel = this.channels.get(channelName)

        if (!channel) {
            console.error('Channel not found for game:', gameId)
            return
        }

        await channel.track({
            userId,
            status: 'online',
        })
    }

    // Unsubscribe from a channel
    private async unsubscribe(channelName: string): Promise<void> {
        const channel = this.channels.get(channelName)
        if (channel) {
            await this.supabase.removeChannel(channel)
            this.channels.delete(channelName)
        }
    }

    // Cleanup all channels
    async cleanup(): Promise<void> {
        for (const channelName of this.channels.keys()) {
            await this.unsubscribe(channelName)
        }
    }
}

// Singleton instance
let realtimeService: RealtimeService | null = null

export function getRealtimeService(): RealtimeService {
    if (!realtimeService) {
        realtimeService = new RealtimeService()
    }
    return realtimeService
}
