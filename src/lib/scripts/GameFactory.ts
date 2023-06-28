import type { Game, GamePlayer, GamePlayerWithProfile, GridGame, GridThemeWithQuestions, RunningGame, TimedThemeWithQuestions } from "$lib/data/supabase/models";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function finalizeGameConfiguration(supabase: SupabaseClient, game: Game) {

        const responses = await Promise.all([
            supabase.from('running_game').delete().eq('id', game.id),
            supabase.from('game_player').select('*, profile(*)').eq('game_key', game.access_key),
            supabase.from('grid_game').select('*').eq('id', game.id).single(),
            supabase.from('timed_theme').select('*, questions:timed_question(*)').eq('game_id', game.id),
            supabase.from('grid_theme').select('*, questions:grid_question(*)').eq('game_id', game.id),
        ]);

        const errors = responses.filter(r => r.error).map(r => r.error);
        if (errors.length > 0) {
            console.error({errors});
            throw new Error('Des erreurs sont survenues durant le chargement des données : ' + errors.join(', '));
        }

        let players = responses[1].data! as GamePlayerWithProfile[];
        let gridGame = responses[2].data! as GridGame;
        let timedThemes = responses[3].data! as TimedThemeWithQuestions[];
        let gridThemes = responses[4].data! as GridThemeWithQuestions[];
        console.log({players, gridGame, timedThemes, gridThemes});

        const runningGame: RunningGame = { 
            id: game.id,
            initiative_value: 50,
            players: players.map(p => { return {
                uid: p.user_id, 
                name: p.profile.display_name,
                picture: p.profile.profile_picture,
                score: 0,
                initiative: 50,
                initiativeOrder: 0,
                displayOrder: 0
            }}),
            state: {
                grid: {
                    points: {self: gridGame.points_theme_self, others: gridGame.points_theme_others},
                    size: {width: 8, height: 5},
                    themes: gridThemes.map(t => { return {
                        id: t.id,
                        name: t.name,
                        color: t.color,
                        owner: t.owner_id, 
                        pointsValue: t.questions[0].points_value,
                        questions: t.questions.map(q => { return {
                            id: q.id,
                            statement: q.statement,
                            answer: q.answer,
                        }})
                    }})
                },
                timed: {
                    themes: timedThemes.map(t => { return {
                        id: t.id,
                        name: t.name,
                        isMystery: t.is_mystery,
                        isRevealed: false,
                        questions: t.questions.map(q => { return {
                            id: q.id,
                            statement: q.statement,
                            answer: q.answer,
                            pointsValue: q.points_value,
                        }})
                    }})
                }
            }
        };

        const { error } = await supabase.from('running_game').insert([runningGame]);
        if (error) {
            console.error({error});
            throw new Error('Une erreur est survenue durant la création de la partie : ' + error.message);
        }


}