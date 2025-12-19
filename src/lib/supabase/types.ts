export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    display_name: string | null
                    avatar_url: string | null
                    elo_rating: number
                    wins: number
                    losses: number
                    draws: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    display_name?: string | null
                    avatar_url?: string | null
                    elo_rating?: number
                    wins?: number
                    losses?: number
                    draws?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    display_name?: string | null
                    avatar_url?: string | null
                    elo_rating?: number
                    wins?: number
                    losses?: number
                    draws?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            games: {
                Row: {
                    id: string
                    white_player_id: string
                    black_player_id: string
                    current_fen: string
                    status: 'waiting' | 'active' | 'completed' | 'abandoned'
                    winner_id: string | null
                    result: 'white_win' | 'black_win' | 'draw' | null
                    time_control: number
                    white_time_remaining: number
                    black_time_remaining: number
                    created_at: string
                    updated_at: string
                    ended_at: string | null
                }
                Insert: {
                    id?: string
                    white_player_id: string
                    black_player_id: string
                    current_fen?: string
                    status?: 'waiting' | 'active' | 'completed' | 'abandoned'
                    winner_id?: string | null
                    result?: 'white_win' | 'black_win' | 'draw' | null
                    time_control?: number
                    white_time_remaining?: number
                    black_time_remaining?: number
                    created_at?: string
                    updated_at?: string
                    ended_at?: string | null
                }
                Update: {
                    id?: string
                    white_player_id?: string
                    black_player_id?: string
                    current_fen?: string
                    status?: 'waiting' | 'active' | 'completed' | 'abandoned'
                    winner_id?: string | null
                    result?: 'white_win' | 'black_win' | 'draw' | null
                    time_control?: number
                    white_time_remaining?: number
                    black_time_remaining?: number
                    created_at?: string
                    updated_at?: string
                    ended_at?: string | null
                }
            }
            game_moves: {
                Row: {
                    id: string
                    game_id: string
                    move_number: number
                    from_square: string
                    to_square: string
                    piece: string
                    promotion: string | null
                    fen_after: string
                    timestamp: string
                    player_id: string
                }
                Insert: {
                    id?: string
                    game_id: string
                    move_number: number
                    from_square: string
                    to_square: string
                    piece: string
                    promotion?: string | null
                    fen_after: string
                    timestamp?: string
                    player_id: string
                }
                Update: {
                    id?: string
                    game_id?: string
                    move_number?: number
                    from_square?: string
                    to_square?: string
                    piece?: string
                    promotion?: string | null
                    fen_after?: string
                    timestamp?: string
                    player_id?: string
                }
            }
            matchmaking_queue: {
                Row: {
                    id: string
                    user_id: string
                    elo_rating: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    elo_rating: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    elo_rating?: number
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
