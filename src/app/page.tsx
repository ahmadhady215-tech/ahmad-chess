'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { LoadingScreen } from '@/components/ui/Loading'

export default function HomePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const supabase = createClient()

    useEffect(() => {
        checkUser()
    }, [])

    async function checkUser() {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
    }

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="p-6 border-b border-primary/20">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <motion.h1
                        className="text-4xl font-bold neon-text"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        AHMAD CHESS
                    </motion.h1>

                    <div className="flex gap-4">
                        {user ? (
                            <>
                                <Button onClick={() => router.push('/dashboard')}>
                                    Dashboard
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={async () => {
                                        await supabase.auth.signOut()
                                        setUser(null)
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button onClick={() => router.push('/auth/signin')}>
                                    Sign In
                                </Button>
                                <Button variant="ghost" onClick={() => router.push('/auth/signup')}>
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center p-6">
                <div className="max-w-6xl w-full">
                    <div className="text-center mb-12">
                        <motion.h2
                            className="text-7xl font-bold text-gradient mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            Master the Board
                        </motion.h2>
                        <motion.p
                            className="text-xl text-gray-400 mb-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            Real-time 1v1 chess with ELO rankings. Challenge players worldwide.
                        </motion.p>

                        {user ? (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button
                                    size="lg"
                                    onClick={() => router.push('/matchmaking')}
                                    className="text-xl px-12 py-6"
                                >
                                    ⚔️ PLAY NOW
                                </Button>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                className="flex gap-4 justify-center"
                            >
                                <Button
                                    size="lg"
                                    onClick={() => router.push('/auth/signin')}
                                    className="text-xl"
                                >
                                    Get Started
                                </Button>
                            </motion.div>
                        )}
                    </div>

                    {/* Features */}
                    <motion.div
                        className="grid md:grid-cols-3 gap-6 mt-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Card variant="neon">
                            <div className="text-center">
                                <div className="text-5xl mb-4">⚡</div>
                                <h3 className="text-xl font-bold text-primary mb-2">
                                    Real-Time Play
                                </h3>
                                <p className="text-gray-400">
                                    Experience instant move synchronization with sub-100ms latency
                                </p>
                            </div>
                        </Card>

                        <Card variant="neon">
                            <div className="text-center">
                                <div className="text-5xl mb-4">🏆</div>
                                <h3 className="text-xl font-bold text-primary mb-2">
                                    ELO Rankings
                                </h3>
                                <p className="text-gray-400">
                                    Compete and climb the ranks with professional ELO rating system
                                </p>
                            </div>
                        </Card>

                        <Card variant="neon">
                            <div className="text-center">
                                <div className="text-5xl mb-4">📊</div>
                                <h3 className="text-xl font-bold text-primary mb-2">
                                    Game Analysis
                                </h3>
                                <p className="text-gray-400">
                                    Review your games move-by-move with complete history
                                </p>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        className="mt-16 grid grid-cols-3 gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                    >
                        <div className="text-center glass-card p-6">
                            <div className="text-4xl font-bold text-primary mb-2">1000+</div>
                            <div className="text-gray-400">Active Players</div>
                        </div>
                        <div className="text-center glass-card p-6">
                            <div className="text-4xl font-bold text-secondary mb-2">10k+</div>
                            <div className="text-gray-400">Games Played</div>
                        </div>
                        <div className="text-center glass-card p-6">
                            <div className="text-4xl font-bold text-accent mb-2">&lt;50ms</div>
                            <div className="text-gray-400">Average Latency</div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Footer */}
            <footer className="p-6 border-t border-primary/20">
                <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
                    <p>© 2025 Ahmad Chess. Built with Next.js & Supabase.</p>
                </div>
            </footer>
        </div>
    )
}
