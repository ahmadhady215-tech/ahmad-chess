import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GameEndRequest {
    gameId: string
    winnerId: string | null
    result: 'white_win' | 'black_win' | 'draw'
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        const { gameId, winnerId, result }: GameEndRequest = await req.json()

        // Fetch game data
        const { data: game, error: gameError } = await supabaseClient
            .from('games')
            .select('*')
            .eq('id', gameId)
            .single()

        if (gameError || !game) {
            throw new Error('Game not found')
        }

        // Fetch all moves
        const { data: moves, error: movesError } = await supabaseClient
            .from('game_moves')
            .select('*')
            .eq('game_id', gameId)
            .order('move_number', { ascending: true })

        if (movesError) {
            throw new Error('Failed to fetch moves')
        }

        // Validate move history (basic validation)
        // In production, you'd replay all moves using chess.js
        const isValid = moves && moves.length > 0

        if (!isValid) {
            throw new Error('Invalid game state')
        }

        // Fetch player data
        const { data: whitePlayer } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', game.white_player_id)
            .single()

        const { data: blackPlayer } = await supabaseClient
            .from('users')
            .select('*')
            .eq('id', game.black_player_id)
            .single()

        if (!whitePlayer || !blackPlayer) {
            throw new Error('Players not found')
        }

        // Calculate ELO changes
        const kFactor = 32

        let whiteChange = 0
        let blackChange = 0

        if (result !== 'draw') {
            const whiteWon = winnerId === game.white_player_id

            const whiteExpected = 1 / (1 + Math.pow(10, (blackPlayer.elo_rating - whitePlayer.elo_rating) / 400))
            const blackExpected = 1 / (1 + Math.pow(10, (whitePlayer.elo_rating - blackPlayer.elo_rating) / 400))

            whiteChange = Math.round(kFactor * ((whiteWon ? 1 : 0) - whiteExpected))
            blackChange = Math.round(kFactor * ((whiteWon ? 0 : 1) - blackExpected))
        }

        // Update game
        await supabaseClient
            .from('games')
            .update({
                status: 'completed',
                winner_id: winnerId,
                result,
                ended_at: new Date().toISOString(),
            })
            .eq('id', gameId)

        // Update players
        if (result === 'draw') {
            await supabaseClient
                .from('users')
                .update({ draws: whitePlayer.draws + 1 })
                .eq('id', game.white_player_id)

            await supabaseClient
                .from('users')
                .update({ draws: blackPlayer.draws + 1 })
                .eq('id', game.black_player_id)
        } else {
            const whiteWon = winnerId === game.white_player_id

            await supabaseClient
                .from('users')
                .update({
                    elo_rating: whitePlayer.elo_rating + whiteChange,
                    wins: whiteWon ? whitePlayer.wins + 1 : whitePlayer.wins,
                    losses: !whiteWon ? whitePlayer.losses + 1 : whitePlayer.losses,
                })
                .eq('id', game.white_player_id)

            await supabaseClient
                .from('users')
                .update({
                    elo_rating: blackPlayer.elo_rating + blackChange,
                    wins: !whiteWon ? blackPlayer.wins + 1 : blackPlayer.wins,
                    losses: whiteWon ? blackPlayer.losses + 1 : blackPlayer.losses,
                })
                .eq('id', game.black_player_id)
        }

        return new Response(
            JSON.stringify({
                success: true,
                whiteChange,
                blackChange,
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )
    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
