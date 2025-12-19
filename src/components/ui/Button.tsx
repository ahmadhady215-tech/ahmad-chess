import React, { ButtonHTMLAttributes } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    children: React.ReactNode
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    children,
    className = '',
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'btn-glow',
        secondary: 'bg-secondary hover:bg-secondary-dark text-white',
        ghost: 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-background',
        danger: 'bg-error hover:bg-error/80 text-white',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    return (
        <motion.button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
            onClick={props.onClick}
            type={props.type}
            id={props.id}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="spinner w-5 h-5 border-2"></span>
                    Loading...
                </span>
            ) : (
                children
            )}
        </motion.button>
    )
}
