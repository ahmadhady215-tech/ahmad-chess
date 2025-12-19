'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { formatTime } from '@/lib/chess'

interface GameClockProps {
    whiteTime: number
    blackTime: number
    activeColor: 'white' | 'black'
    playerColor: 'white' | 'black'
}

export function GameClock({
    whiteTime,
    blackTime,
    activeColor,
    playerColor,
}: GameClockProps) {
    const [displayWhiteTime, setDisplayWhiteTime] = useState(whiteTime)
    const [displayBlackTime, setDisplayBlackTime] = useState(blackTime)

    useEffect(() => {
        setDisplayWhiteTime(whiteTime)
        setDisplayBlackTime(blackTime)
    }, [whiteTime, blackTime])

    const isWhiteLow = displayWhiteTime < 60
    const isBlackLow = displayBlackTime < 60
    const isWhiteCritical = displayWhiteTime < 30
    const isBlackCritical = displayBlackTime < 30

    return (
        <div className="flex flex-col gap-4">
            {/* Opponent Clock (top) */}
            <ClockDisplay
                time={playerColor === 'white' ? displayBlackTime : displayWhiteTime}
                isActive={playerColor === 'white' ? activeColor === 'black' : activeColor === 'white'}
                isLow={playerColor === 'white' ? isBlackLow : isWhiteLow}
                isCritical={playerColor === 'white' ? isBlackCritical : isWhiteCritical}
                label="Opponent"
                color={playerColor === 'white' ? 'black' : 'white'}
            />

            {/* Player Clock (bottom) */}
            <ClockDisplay
                time={playerColor === 'white' ? displayWhiteTime : displayBlackTime}
                isActive={playerColor === 'white' ? activeColor === 'white' : activeColor === 'black'}
                isLow={playerColor === 'white' ? isWhiteLow : isBlackLow}
                isCritical={playerColor === 'white' ? isWhiteCritical : isBlackCritical}
                label="You"
                color={playerColor}
            />
        </div>
    )
}

interface ClockDisplayProps {
    time: number
    isActive: boolean
    isLow: boolean
    isCritical: boolean
    label: string
    color: 'white' | 'black'
}

function ClockDisplay({
    time,
    isActive,
    isLow,
    isCritical,
    label,
    color,
}: ClockDisplayProps) {
    const formattedTime = formatTime(time)

    const glowColor = isCritical
        ? 'rgba(255, 51, 102, 0.6)'
        : isLow
            ? 'rgba(255, 170, 0, 0.6)'
            : 'rgba(0, 255, 255, 0.6)'

    return (
        <motion.div
            className={`neon-card p-4 ${isActive ? 'border-primary' : 'border-primary/20'}`}
            animate={{
                boxShadow: isActive
                    ? `0 0 20px ${glowColor}, 0 0 40px ${glowColor}`
                    : '0 0 15px rgba(0, 255, 255, 0.1)',
            }}
            transition={{ duration: 0.3 }}
        >
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">{label}</span>
                    <span className="text-xs text-gray-500">
                        ({color === 'white' ? '♔' : '♚'})
                    </span>
                </div>
                <motion.div
                    className={`font-mono text-3xl font-bold ${isCritical ? 'text-error' : isLow ? 'text-warning' : 'text-primary'
                        }`}
                    animate={{
                        scale: isActive && isCritical ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                        duration: 1,
                        repeat: isActive && isCritical ? Infinity : 0,
                    }}
                >
                    {formattedTime}
                </motion.div>
            </div>
            {isActive && (
                <motion.div
                    className="mt-2 h-1 bg-primary rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </motion.div>
    )
}
