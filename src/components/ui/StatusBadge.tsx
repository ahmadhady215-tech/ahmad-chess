import React from 'react'

interface StatusBadgeProps {
    status: 'online' | 'offline' | 'playing'
    showText?: boolean
}

export function StatusBadge({ status, showText = true }: StatusBadgeProps) {
    const styles = {
        online: 'bg-success',
        offline: 'bg-gray-500',
        playing: 'bg-warning',
    }

    const text = {
        online: 'Online',
        offline: 'Offline',
        playing: 'In Game',
    }

    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${styles[status]} ${status === 'online' ? 'animate-pulse' : ''}`} />
            {showText && (
                <span className="text-sm text-gray-400">{text[status]}</span>
            )}
        </div>
    )
}
