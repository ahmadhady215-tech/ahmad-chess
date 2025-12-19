'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'

interface Move {
    moveNumber: number
    white?: string
    black?: string
}

interface MoveHistoryProps {
    moves: string[]
}

export function MoveHistory({ moves }: MoveHistoryProps) {
    // Convert flat array to paired moves
    const pairedMoves: Move[] = []
    for (let i = 0; i < moves.length; i += 2) {
        pairedMoves.push({
            moveNumber: Math.floor(i / 2) + 1,
            white: moves[i],
            black: moves[i + 1],
        })
    }

    return (
        <Card variant="neon" hover={false} className="h-full max-h-[500px] overflow-hidden flex flex-col">
            <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <span>📜</span>
                Move History
            </h3>

            <div className="flex-1 overflow-y-auto scrollbar-custom">
                {pairedMoves.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No moves yet</p>
                ) : (
                    <div className="space-y-1">
                        <AnimatePresence>
                            {pairedMoves.map((move, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="grid grid-cols-3 gap-2 p-2 rounded bg-background-lighter hover:bg-background-light transition-colors"
                                >
                                    <div className="text-gray-400 font-mono text-sm">
                                        {move.moveNumber}.
                                    </div>
                                    <div className="text-white font-mono text-sm">
                                        {move.white || '...'}
                                    </div>
                                    <div className="text-gray-300 font-mono text-sm">
                                        {move.black || '...'}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </Card>
    )
}
