import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Ahmad Chess | Real-Time Chess',
    description: 'Professional real-time 1v1 chess game with ELO rankings',
    keywords: ['chess', 'online chess', 'real-time chess', 'chess game', 'multiplayer chess'],
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
