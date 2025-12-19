import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
    children: ReactNode
    variant?: 'neon' | 'glass'
    className?: string
    hover?: boolean
}

export function Card({ children, variant = 'neon', className = '', hover = true }: CardProps) {
    const variants = {
        neon: 'neon-card',
        glass: 'glass-card',
    }

    return (
        <motion.div
            className={`${variants[variant]} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={hover ? { y: -5 } : {}}
        >
            {children}
        </motion.div>
    )
}
