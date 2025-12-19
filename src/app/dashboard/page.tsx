'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingScreen } from '@/components/ui/Loading'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/types'

type UserProfile = Database['public']['Tables']['users']['Row']
type GameRecord = Database['public']['Tables']['games']['Row']

export default function DashboardPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [recentGames, setRecentGames] = useState<GameRecord[]>([])

    useEffect(() => {
        loadDashboard()
    }, [])

    async function loadDashboard() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/auth/signin')
            return
        }

        // Load user profile
        const { data: profileData } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

        setProfile(profileData)

        // Load recent games
        const { data: gamesData } = await supabase
            .from('games')
            .select('*')
            .or(`white_player_id.eq.${session.user.id},black_player_id.eq.${session.user.id}`)
            .order('created_at', { ascending: false })
            .limit(5)

        setRecentGames(gamesData || [])
        setLoading(false)
    }

    async function handleSignOut() {
        await supabase.auth.signOut()
        router.push('/')
    }

    if (loading || !profile) {
        return <LoadingScreen />
    }

    const winRate = profile.wins + profile.losses > 0
        ? ((profile.wins / (profile.wins + profile.losses)) * 100).toFixed(1)
        : '0.0'

    return (
        <div className="min-h-screen p-6">
            {/* Header */}
            <header className="max-w-7xl mx-auto mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold neon-text">Dashboard</h1>
                    <div className="flex gap-4">
                        <Button onClick={() => router.push('/')}>Home</Button>
                        <Button variant="ghost" onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto">
                {/* Profile Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <Card variant="glass">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold">
                                    {profile.display_name?.charAt(0).toUpperCase() || profile.email.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">
                                        {profile.display_name || 'Player'}
                                    </h2>
                                    <p className="text-gray-400">{profile.email}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-5xl font-bold text-primary mb-2">
                                    {profile.elo_rating}
                                </div>
                                <div className="text-gray-400">ELO Rating</div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <Button
                        size="lg"
                        className="w-full text-2xl py-8"
                        onClick={() => router.push('/matchmaking')}
                    >
                        ⚔️ FIND MATCH
                    </Button>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid md:grid-cols-4 gap-6 mb-8"
                >
                    <Card variant="neon">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-success mb-2">
                                {profile.wins}
                            </div>
                            <div className="text-gray-400">Wins</div>
                        </div>
                    </Card>

                    <Card variant="neon">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-error mb-2">
                                {profile.losses}
                            </div>
                            <div className="text-gray-400">Losses</div>
                        </div>
                    </Card>

                    <Card variant="neon">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-warning mb-2">
                                {profile.draws}
                            </div>
                            <div className="text-gray-400">Draws</div>
                        </div>
                    </Card>

                    <Card variant="neon">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-primary mb-2">
                                {winRate}%
                            </div>
                            <div className="text-gray-400">Win Rate</div>
                        </div>
                    </Card>
                </motion.div>

                {/* Recent Games */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card variant="neon">
                        <h3 className="text-2xl font-bold text-primary mb-6">
                            Recent Games
                        </h3>

                        {recentGames.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                <p className="text-xl mb-2">No games played yet</p>
                                <p>Start your chess journey by finding a match!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentGames.map((game) => {
                                    const isWhite = game.white_player_id === profile.id
                                    const won = game.winner_id === profile.id
                                    const isDraw = game.result === 'draw'

                                    return (
                                        <div
                                            key={game.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-background-lighter hover:bg-background-light transition-colors cursor-pointer"
                                            onClick={() => router.push(`/game/${game.id}/review`)}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="text-3xl">
                                                    {isWhite ? '♔' : '♚'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-white">
                                                        {game.status === 'completed'
                                                            ? (isDraw ? 'Draw' : won ? 'Victory' : 'Defeat')
                                                            : 'Abandoned'}
                                                    </div>
                                                    <div className="text-sm text-gray-400">
                                                        {new Date(game.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg font-semibold ${isDraw ? 'bg-warning/20 text-warning' :
                                                    won ? 'bg-success/20 text-success' :
                                                        'bg-error/20 text-error'
                                                }`}>
                                                {isDraw ? 'Draw' : won ? '+' : '-'}
                                                {!isDraw && '12'}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
