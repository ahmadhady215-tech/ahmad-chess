'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Loading, LoadingScreen } from '@/components/ui/Loading'
import { createClient } from '@/lib/supabase/client'

export default function MatchmakingPage() {
    const router = useRouter()
    const supabase = createClient()

    const [loading, setLoading] = useState(true)
    const [searching, setSearching] = useState(false)
    const [userId, setUserId] = useState<string | null>(null)
    const [userRating, setUserRating] = useState<number>(1200)
    const [dots, setDots] = useState('')

    useEffect(() => {
        checkAuth()
    }, [])

    useEffect(() => {
        if (searching) {
            const interval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? '' : prev + '.')
            }, 500)
            return () => clearInterval(interval)
        }
    }, [searching])

    useEffect(() => {
        if (userId) {
            const channel = supabase
                .channel('matchmaking')
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'games',
                    filter: `white_player_id=eq.${userId}`,
                }, (payload) => {
                    router.push(`/game/${payload.new.id}`)
                })
                .on('postgres_changes', {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'games',
                    filter: `black_player_id=eq.${userId}`,
                }, (payload) => {
                    router.push(`/game/${payload.new.id}`)
                })
                .subscribe()

            return () => {
                supabase.removeChannel(channel)
            }
        }
    }, [userId])

    async function checkAuth() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/auth/signin')
            return
        }

        const { data: profile } = await supabase
            .from('users')
            .select('elo_rating')
            .eq('id', session.user.id)
            .single()

        setUserId(session.user.id)
        setUserRating(profile?.elo_rating || 1200)
        setLoading(false)
    }

    async function startMatchmaking() {
        if (!userId) return

        setSearching(true)

        // Add to matchmaking queue
        const { error: queueError } = await supabase
            .from('matchmaking_queue')
            .insert({
                user_id: userId,
                elo_rating: userRating,
            })

        if (queueError) {
            console.error('Queue error:', queueError)
            setSearching(false)
            return
        }

        // Try to find a match
        await findMatch()
    }

    async function findMatch() {
        if (!userId) return

        // Look for opponents in similar ELO range (±200)
        const { data: opponents } = await supabase
            .from('matchmaking_queue')
            .select('*')
            .neq('user_id', userId)
            .gte('elo_rating', userRating - 200)
            .lte('elo_rating', userRating + 200)
            .limit(1)

        if (opponents && opponents.length > 0) {
            const opponent = opponents[0]

            // Create game
            const isWhite = Math.random() > 0.5
            const { data: game, error: gameError } = await supabase
                .from('games')
                .insert({
                    white_player_id: isWhite ? userId : opponent.user_id,
                    black_player_id: isWhite ? opponent.user_id : userId,
                    status: 'active',
                })
                .select()
                .single()

            if (!gameError && game) {
                // Remove both players from queue
                await supabase
                    .from('matchmaking_queue')
                    .delete()
                    .in('user_id', [userId, opponent.user_id])

                router.push(`/game/${game.id}`)
            }
        } else {
            // No match found, keep searching
            setTimeout(() => {
                if (searching) {
                    findMatch()
                }
            }, 2000)
        }
    }

    async function cancelMatchmaking() {
        if (!userId) return

        await supabase
            .from('matchmaking_queue')
            .delete()
            .eq('user_id', userId)

        setSearching(false)
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                <Card variant="neon">
                    <div className="text-center">
                        <h1 className="text-5xl font-bold neon-text mb-8">
                            {searching ? 'Finding Opponent' : 'Ready to Play'}
                        </h1>

                        <AnimatePresence mode="wait">
                            {searching ? (
                                <motion.div
                                    key="searching"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-12"
                                >
                                    <div className="mb-8">
                                        <Loading size="lg" />
                                    </div>

                                    <motion.p
                                        className="text-2xl text-gray-300 mb-8"
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        Searching for player{dots}
                                    </motion.p>

                                    <div className="glass-card p-6 mb-8">
                                        <div className="flex justify-around">
                                            <div>
                                                <div className="text-gray-400 text-sm mb-2">Your ELO</div>
                                                <div className="text-3xl font-bold text-primary">
                                                    {userRating}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-gray-400 text-sm mb-2">Looking for</div>
                                                <div className="text-3xl font-bold text-secondary">
                                                    {userRating - 200} - {userRating + 200}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        variant="danger"
                                        size="lg"
                                        onClick={cancelMatchmaking}
                                    >
                                        Cancel Search
                                    </Button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="ready"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-12"
                                >
                                    <div className="text-8xl mb-8">♟️</div>

                                    <div className="glass-card p-6 mb-8">
                                        <div className="text-gray-400 text-sm mb-2">Your ELO Rating</div>
                                        <div className="text-5xl font-bold text-primary mb-4">
                                            {userRating}
                                        </div>
                                        <div className="text-gray-400">
                                            You'll be matched with players of similar skill level
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <Button
                                            size="lg"
                                            className="w-full text-xl py-6"
                                            onClick={startMatchmaking}
                                        >
                                            🎯 Find Match (5 min Blitz)
                                        </Button>

                                        <Button
                                            variant="ghost"
                                            onClick={() => router.push('/dashboard')}
                                        >
                                            ← Back to Dashboard
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </Card>
            </motion.div>
        </div>
    )
}
