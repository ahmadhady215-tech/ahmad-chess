'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Chessboard } from 'react-chessboard'
import { Square } from 'chess.js'
import { ChessGame } from '@/lib/chess'
import { motion } from 'framer-motion'

interface ChessBoardProps {
    fen: string
    onMove: (from: Square, to: Square, promotion?: string) => void
    playerColor: 'white' | 'black'
    isPlayerTurn: boolean
    highlightSquares?: Square[]
    disabled?: boolean
}

export function ChessBoard({
    fen,
    onMove,
    playerColor,
    isPlayerTurn,
    highlightSquares = [],
    disabled = false,
}: ChessBoardProps) {
    const [game] = useState(() => new ChessGame(fen))
    const [moveFrom, setMoveFrom] = useState<Square | null>(null)
    const [moveTo, setMoveTo] = useState<Square | null>(null)
    const [showPromotionDialog, setShowPromotionDialog] = useState(false)
    const [optionSquares, setOptionSquares] = useState<Record<string, any>>({})

    useEffect(() => {
        game.load(fen)
    }, [fen, game])

    const getMoveOptions = useCallback(
        (square: Square) => {
            const moves = game.getPossibleMoves(square)
            if (moves.length === 0) {
                setOptionSquares({})
                return false
            }

            const newSquares: Record<string, any> = {}
            moves.forEach((move) => {
                newSquares[move] = {
                    background:
                        'radial-gradient(circle, rgba(0,255,255,0.3) 25%, transparent 25%)',
                    borderRadius: '50%',
                }
            })
            newSquares[square] = {
                background: 'rgba(255, 0, 255, 0.4)',
            }
            setOptionSquares(newSquares)
            return true
        },
        [game]
    )

    function onSquareClick(square: Square) {
        if (disabled || !isPlayerTurn) return

        // If no piece selected, try to select
        if (!moveFrom) {
            const hasMoveOptions = getMoveOptions(square)
            if (hasMoveOptions) {
                setMoveFrom(square)
            }
            return
        }

        // If clicking the same square, deselect
        if (moveFrom === square) {
            setMoveFrom(null)
            setOptionSquares({})
            return
        }

        // Check if move requires promotion
        const piece = game.getPossibleMoves(moveFrom)
        const isPromotion =
            piece.length > 0 &&
            moveFrom[1] === (playerColor === 'white' ? '7' : '2') &&
            square[1] === (playerColor === 'white' ? '8' : '1')

        if (isPromotion) {
            setMoveTo(square)
            setShowPromotionDialog(true)
        } else {
            // Make the move
            const move = game.move(moveFrom, square)
            if (move) {
                onMove(moveFrom, square)
                setMoveFrom(null)
                setMoveTo(null)
                setOptionSquares({})
            } else {
                // Invalid move, try to select new piece
                const hasMoveOptions = getMoveOptions(square)
                if (hasMoveOptions) {
                    setMoveFrom(square)
                } else {
                    setMoveFrom(null)
                    setOptionSquares({})
                }
            }
        }
    }

    function onPromotionPieceSelect(piece: 'q' | 'r' | 'b' | 'n') {
        if (moveFrom && moveTo) {
            onMove(moveFrom, moveTo, piece)
            setMoveFrom(null)
            setMoveTo(null)
            setShowPromotionDialog(false)
            setOptionSquares({})
        }
    }

    // Custom square styles
    const customSquareStyles: Record<string, any> = {
        ...optionSquares,
    }

    // Highlight check
    if (game.isCheck()) {
        const kingSquare = game.getKingSquare(game.turn())
        if (kingSquare) {
            customSquareStyles[kingSquare] = {
                background: 'radial-gradient(circle, rgba(255, 51, 102, 0.8) 0%, rgba(255, 51, 102, 0.3) 100%)',
            }
        }
    }

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="rounded-xl overflow-hidden shadow-2xl"
                style={{
                    boxShadow: '0 0 40px rgba(0, 255, 255, 0.3)',
                }}
            >
                <Chessboard
                    position={fen}
                    onSquareClick={onSquareClick}
                    boardOrientation={playerColor}
                    customSquareStyles={customSquareStyles}
                    customBoardStyle={{
                        borderRadius: '4px',
                    }}
                    customLightSquareStyle={{
                        backgroundColor: '#f0d9b5',
                    }}
                    customDarkSquareStyle={{
                        backgroundColor: '#b58863',
                    }}
                    arePiecesDraggable={false}
                />
            </motion.div>

            {/* Promotion Dialog */}
            {showPromotionDialog && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-xl z-50">
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-bold text-primary mb-4">
                            Choose Promotion
                        </h3>
                        <div className="flex gap-4">
                            {(['q', 'r', 'b', 'n'] as const).map((piece) => (
                                <button
                                    key={piece}
                                    onClick={() => onPromotionPieceSelect(piece)}
                                    className="neon-card p-4 hover:scale-110 transition-transform"
                                >
                                    <span className="text-4xl">
                                        {playerColor === 'white'
                                            ? { q: '♕', r: '♖', b: '♗', n: '♘' }[piece]
                                            : { q: '♛', r: '♜', b: '♝', n: '♞' }[piece]}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
