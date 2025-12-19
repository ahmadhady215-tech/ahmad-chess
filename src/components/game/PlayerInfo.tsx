'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { StatusBadge } from '@/components/ui/StatusBadge'

interface PlayerInfoProps {
    name: string
    rating: number
    isOnline: boolean
    avatar?: string
    color: 'white' | 'black'
}

export function PlayerInfo({
    name,
    rating,
    isOnline,
    avatar,
    color,
}: PlayerInfoProps) {
    return (
        <Card variant="glass" hover={false} className="p-4">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <motion.div
                    className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                >
                    {avatar ? (
                        <img src={avatar} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-2xl font-bold">
                            {name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </motion.div>

                {/* Player Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{name}</h3>
                        <span className="text-2xl">
                            {color === 'white' ? '♔' : '♚'}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-400">ELO:</span>
                            <span className="text-sm font-bold text-primary">{rating}</span>
                        </div>
                        <StatusBadge status={isOnline ? 'online' : 'offline'} showText={false} />
                    </div>
                </div>
            </div>
        </Card>
    )
}
