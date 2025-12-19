'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Square } from 'chess.js'
import { motion } from 'framer-motion'
import { ChessBoard } from '@/components/game/ChessBoard'
import { GameClock } from '@/components/game/GameClock'
import { MoveHistory } from '@/components/game/MoveHistory'
import { PlayerInfo } from '@/components/game/PlayerInfo'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { LoadingScreen } from '@/components/ui/Loading'
import { createClient } from '@/lib/supabase/client'
import { ChessGame, calculateEloChange } from '@/lib/chess'
import { getRealtimeService } from '@/lib/realtime'
import { Database } from '@/lib/supabase/types'

type GameData = Database['public']['Tables']['games']['Row']
type UserData = Database['public']['Tables']['users']['Row']

export default function GamePage({ params }: { params: { id: string } }) {
    const { id: gameId } = params
    const router = useRouter()
    const supabase = createClient()
    const realtimeService = getRealtimeService()

    const [loading, setLoading] = useState(true)
    const [game, setGame] = useState<GameData | null>(null)
    const [chessGame] = useState(() => new ChessGame())
    const [currentUser, setCurrentUser] = useState<UserData | null>(null)
    const [whitePlayer, setWhitePlayer] = useState<UserData | null>(null)
    const [blackPlayer, setBlackPlayer] = useState<UserData | null>(null)
    const [fen, setFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
    const [moveHistory, setMoveHistory] = useState<string[]>([])
    const [whiteTime, setWhiteTime] = useState(300)
    const [blackTime, setBlackTime] = useState(300)
    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState<string | null>(null)
    const [resultMessage, setResultMessage] = useState('')

    useEffect(() => {
        loadGame()

        return () => {
            realtimeService.cleanup()
        }
    }, [gameId])

    useEffect(() => {
        if (game && currentUser) {
            // Subscribe to real-time updates
            const unsubscribe = realtimeService.subscribeToGame(
                gameId,
                handleMoveReceived,
                handleTimeUpdate,
                handlePresence
            )

            // Track presence
            realtimeService.trackPresence(gameId, currentUser.id)

            // Start clock timer
            const timer = setInterval(() => {
                if (game.status === 'active' && !gameOver) {
                    const turn = chessGame.turn()
                    if (turn === 'w') {
                        setWhiteTime(prev => {
                            const newTime = Math.max(0, prev - 1)
                            if (newTime === 0) {
                                handleTimeout('white')
                            }
                            return newTime
                        })
                    } else {
                        setBlackTime(prev => {
                            const newTime = Math.max(0, prev - 1)
                            if (newTime === 0) {
                                handleTimeout('black')
                            }
                            return newTime
                        })
                    }
                }
            }, 1000)

            return () => {
                unsubscribe()
                clearInterval(timer)
            }
        }
    }, [game, currentUser, gameOver])

    async function loadGame() {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
            router.push('/auth/signin')
            return
        }

        // Load game data
        const { data: gameData } = await supabase
            .from('games')
            .select('*')
            .eq('id', gameId)
            .single()

        if (!gameData) {
            router.push('/dashboard')
            return
        }

        setGame(gameData)
        chessGame.load(gameData.current_fen)
        setFen(gameData.current_fen)
        setWhiteTime(gameData.white_time_remaining)
        setBlackTime(gameData.black_time_remaining)

        // Load players
        const { data: white } = await supabase
            .from('users')
            .select('*')
            .eq('id', gameData.white_player_id)
            .single()

        const { data: black } = await supabase
            .from('users')
            .select('*')
            .eq('id', gameData.black_player_id)
            .single()

        const { data: current } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

        setWhitePlayer(white)
        setBlackPlayer(black)
        setCurrentUser(current)

        // Load move history
        const { data: moves } = await supabase
            .from('game_moves')
            .select('*')
            .eq('game_id', gameId)
            .order('move_number', { ascending: true })

        if (moves) {
            const history = moves.map(move => `${move.from_square}${move.to_square}`)
            setMoveHistory(chessGame.getHistory())
        }

        if (gameData.status === 'completed') {
            setGameOver(true)
            setWinner(gameData.winner_id || null)
            setResultMessage(getResultMessage(gameData))
        }

        setLoading(false)
    }

    function handleMoveReceived(move: any) {
        const result = chessGame.move(move.from as Square, move.to as Square, move.promotion)
        if (result) {
            setFen(move.fen)
            setMoveHistory(chessGame.getHistory())

            if (chessGame.isGameOver()) {
                handleGameEnd()
            }
        }
    }

    function handleTimeUpdate(time: any) {
        setWhiteTime(time.whiteTime)
        setBlackTime(time.blackTime)
    }

    function handlePresence(presence: any[]) {
        // Handle player presence
        console.log('Presence update:', presence)
    }

    async function handleMove(from: Square, to: Square, promotion?: string) {
        if (!game || !currentUser) return

        const playerColor = game.white_player_id === currentUser.id ? 'w' : 'b'
        if (chessGame.turn() !== playerColor) return

        const move = chessGame.move(from, to, promotion)
        if (!move) return

        const newFen = chessGame.getFen()
        setFen(newFen)
        setMoveHistory(chessGame.getHistory())

        // Save move to database
        await supabase.from('game_moves').insert({
            game_id: gameId,
            move_number: moveHistory.length + 1,
            from_square: from,
            to_square: to,
            piece: move.piece,
            promotion: promotion || null,
            fen_after: newFen,
            player_id: currentUser.id,
        })

        // Update game state
        await supabase
            .from('games')
            .update({
                current_fen: newFen,
                white_time_remaining: whiteTime,
                black_time_remaining: blackTime,
            })
            .eq('id', gameId)

        // Broadcast move
        await realtimeService.broadcastMove(gameId, {
            from,
            to,
            promotion,
            fen: newFen,
            timestamp: Date.now(),
        })

        // Check for game over
        if (chessGame.isGameOver()) {
            await handleGameEnd()
        }
    }

    async function handleTimeout(color: 'white' | 'black') {
        const winner = color === 'white' ? game?.black_player_id : game?.white_player_id
        await endGame(winner || null, color === 'white' ? 'black_win' : 'white_win')
    }

    async function handleGameEnd() {
        if (!game) return

        const result = chessGame.getGameResult()
        let winnerId: string | null = null

        if (result === 'white_win') {
            winnerId = game.white_player_id
        } else if (result === 'black_win') {
            winnerId = game.black_player_id
        }

        await endGame(winnerId, result)
    }

    async function handleResign() {
        if (!game || !currentUser) return

        const winnerId = game.white_player_id === currentUser.id
            ? game.black_player_id
            : game.white_player_id

        const result = game.white_player_id === currentUser.id ? 'black_win' : 'white_win'

        await endGame(winnerId, result)
    }

    async function endGame(winnerId: string | null, result: 'white_win' | 'black_win' | 'draw' | null) {
        if (!game || !whitePlayer || !blackPlayer) return

        // Update game status
        await supabase
            .from('games')
            .update({
                status: 'completed',
                winner_id: winnerId,
                result,
                ended_at: new Date().toISOString(),
            })
            .eq('id', gameId)

        // Calculate ELO changes
        if (result !== 'draw' && winnerId) {
            const whiteWon = winnerId === game.white_player_id
            const whiteChange = calculateEloChange(
                whitePlayer.elo_rating,
                blackPlayer.elo_rating,
                whiteWon ? 'win' : 'loss'
            )
            const blackChange = calculateEloChange(
                blackPlayer.elo_rating,
                whitePlayer.elo_rating,
                whiteWon ? 'loss' : 'win'
            )

            // Update white player
            await supabase
                .from('users')
                .update({
                    elo_rating: whitePlayer.elo_rating + whiteChange,
                    wins: whiteWon ? whitePlayer.wins + 1 : whitePlayer.wins,
                    losses: !whiteWon ? whitePlayer.losses + 1 : whitePlayer.losses,
                })
                .eq('id', game.white_player_id)

            // Update black player
            await supabase
                .from('users')
                .update({
                    elo_rating: blackPlayer.elo_rating + blackChange,
                    wins: !whiteWon ? blackPlayer.wins + 1 : blackPlayer.wins,
                    losses: whiteWon ? blackPlayer.losses + 1 : blackPlayer.losses,
                })
                .eq('id', game.black_player_id)
        } else if (result === 'draw') {
            await supabase
                .from('users')
                .update({ draws: whitePlayer.draws + 1 })
                .eq('id', game.white_player_id)

            await supabase
                .from('users')
                .update({ draws: blackPlayer.draws + 1 })
                .eq('id', game.black_player_id)
        }

        setGameOver(true)
        setWinner(winnerId)
        setResultMessage(getResultMessage({ ...game, winner_id: winnerId, result }))
    }

    function getResultMessage(gameData: any): string {
        if (gameData.result === 'draw') return 'Game ended in a draw'
        if (gameData.winner_id === currentUser?.id) return 'You won!'
        return 'You lost'
    }

    if (loading || !game || !currentUser || !whitePlayer || !blackPlayer) {
        return <LoadingScreen />
    }

    const playerColor = game.white_player_id === currentUser.id ? 'white' : 'black'
    const isPlayerTurn = (chessGame.turn() === 'w' && playerColor === 'white') ||
        (chessGame.turn() === 'b' && playerColor === 'black')
    const opponent = playerColor === 'white' ? blackPlayer : whitePlayer

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Game Over Modal */}
                {gameOver && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                    >
                        <Card variant="glass" className="max-w-md w-full">
                            <div className="text-center">
                                <div className="text-7xl mb-4">
                                    {winner === currentUser.id ? '🏆' : winner ? '😔' : '🤝'}
                                </div>
                                <h2 className="text-4xl font-bold text-primary mb-4">
                                    {resultMessage}
                                </h2>
                                <div className="space-y-4 mt-8">
                                    <Button className="w-full" onClick={() => router.push('/dashboard')}>
                                        Back to Dashboard
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="w-full"
                                        onClick={() => router.push('/matchmaking')}
                                    >
                                        Play Again
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold neon-text">Ahmad Chess</h1>
                    <div className="flex gap-4">
                        <Button variant="danger" onClick={handleResign} disabled={gameOver}>
                            Resign
                        </Button>
                    </div>
                </div>

                {/* Main Game Layout */}
                <div className="grid lg:grid-cols-[300px_1fr_300px] gap-6">
                    {/* Left Sidebar - Player Info & Clock */}
                    <div className="space-y-4">
                        <PlayerInfo
                            name={opponent.display_name || 'Opponent'}
                            rating={opponent.elo_rating}
                            isOnline={true}
                            avatar={opponent.avatar_url || undefined}
                            color={playerColor === 'white' ? 'black' : 'white'}
                        />

                        <GameClock
                            whiteTime={whiteTime}
                            blackTime={blackTime}
                            activeColor={chessGame.turn() === 'w' ? 'white' : 'black'}
                            playerColor={playerColor}
                        />
                    </div>

                    {/* Center - Chess Board */}
                    <div>
                        <ChessBoard
                            fen={fen}
                            onMove={handleMove}
                            playerColor={playerColor}
                            isPlayerTurn={isPlayerTurn}
                            disabled={gameOver}
                        />

                        {isPlayerTurn && !gameOver && (
                            <motion.div
                                className="mt-4 text-center"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            >
                                <p className="text-primary font-bold text-lg">Your turn</p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Sidebar - Move History */}
                    <div>
                        <MoveHistory moves={moveHistory} />
                    </div>
                </div>
            </div>
        </div>
    )
}
