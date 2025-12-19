import React from 'react'
import { motion } from 'framer-motion'

interface LoadingProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
}

export function Loading({ size = 'md', text }: LoadingProps) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <motion.div
                className={`spinner ${sizes[size]}`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            {text && <p className="text-gray-400 text-sm">{text}</p>}
        </div>
    )
}

export function LoadingScreen() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-6xl font-bold neon-text mb-8">AHMAD CHESS</h1>
                    <Loading size="lg" text="Initializing..." />
                </motion.div>
            </div>
        </div>
    )
}
