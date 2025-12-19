import { Chess, Move, Square } from 'chess.js'

export class ChessGame {
    private game: Chess

    constructor(fen?: string) {
        this.game = new Chess(fen)
    }

    getFen(): string {
        return this.game.fen()
    }

    getPgn(): string {
        return this.game.pgn()
    }

    isGameOver(): boolean {
        return this.game.isGameOver()
    }

    isCheckmate(): boolean {
        return this.game.isCheckmate()
    }

    isStalemate(): boolean {
        return this.game.isStalemate()
    }

    isDraw(): boolean {
        return this.game.isDraw()
    }

    isCheck(): boolean {
        return this.game.isCheck()
    }

    turn(): 'w' | 'b' {
        return this.game.turn()
    }

    move(from: Square, to: Square, promotion?: string): Move | null {
        try {
            const move = this.game.move({
                from,
                to,
                promotion: promotion as any,
            })
            return move
        } catch (error) {
            console.error('Invalid move:', error)
            return null
        }
    }

    getPossibleMoves(square: Square): Square[] {
        const moves = this.game.moves({ square, verbose: true })
        return moves.map((move) => move.to as Square)
    }

    getGameResult(): 'white_win' | 'black_win' | 'draw' | null {
        if (!this.isGameOver()) return null

        if (this.isCheckmate()) {
            return this.turn() === 'w' ? 'black_win' : 'white_win'
        }

        return 'draw'
    }

    reset(): void {
        this.game.reset()
    }

    load(fen: string): void {
        this.game.load(fen)
    }

    getHistory(): string[] {
        return this.game.history()
    }

    undo(): Move | null {
        return this.game.undo()
    }

    isValidMove(from: Square, to: Square): boolean {
        const moves = this.getPossibleMoves(from)
        return moves.includes(to)
    }

    getSquareColor(square: Square): 'light' | 'dark' {
        const file = square.charCodeAt(0) - 97 // 'a' = 97
        const rank = parseInt(square[1])
        return (file + rank) % 2 === 0 ? 'dark' : 'light'
    }

    getKingSquare(color: 'w' | 'b'): Square | null {
        const board = this.game.board()
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j]
                if (piece && piece.type === 'k' && piece.color === color) {
                    const file = String.fromCharCode(97 + j)
                    const rank = 8 - i
                    return `${file}${rank}` as Square
                }
            }
        }
        return null
    }
}

// ELO Rating calculation
export function calculateEloChange(
    playerRating: number,
    opponentRating: number,
    result: 'win' | 'loss' | 'draw',
    kFactor: number = 32
): number {
    const expectedScore =
        1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400))

    const actualScore = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0

    const ratingChange = Math.round(kFactor * (actualScore - expectedScore))

    return ratingChange
}

// Format time in MM:SS
export function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Convert move to algebraic notation
export function moveToAlgebraic(move: Move): string {
    return move.san
}

// Validate FEN string
export function isValidFen(fen: string): boolean {
    try {
        const chess = new Chess(fen)
        return true
    } catch {
        return false
    }
}
