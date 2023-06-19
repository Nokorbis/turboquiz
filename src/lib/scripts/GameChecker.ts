import type { Game, PlayerWithTheme } from "$lib/data/supabase/models";
import type { Database } from "$lib/data/supabase/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export function loadGridPlayersAndThemes(supabase: SupabaseClient<Database>, game: Game) {
    return supabase
        .from('v_themes_by_players')
        .select('*')
        .eq('game_key', game.access_key)
        .order('display_name', { ascending: true })
        .order('user_id', { ascending: true })
        .then(({ data, error }) => {
            if (error) {
                return {data: [], error};
            }
            let playersMap = new Map<string, PlayerWithTheme>();
            data.forEach((row: PlayerWithTheme) => {
                let player = playersMap.get(row.user_id!);
                if (!player) {
                    player = {
                        game_key: row.game_key!,
                        user_id: row.user_id!,
                        player_id: row.game_player_id!,
                        display_name: row.display_name!,
                        profile_picture: row.profile_picture!,
                        themes: []
                    };
                    playersMap.set(row.user_id!, player);
                }
                if (row.name || row.color) {
                    player.themes.push({
                        name: row.name!,
                        color: row.color!
                    });
                }
            });

            return {data: Array.from(playersMap.values()), error: null};
        });
}

export interface PlayerWithThemes {
    game_key: string;
    user_id: string;
    player_id: number;
    display_name: string;
    profile_picture: string;
    themes: PlayerTheme[];
}

export interface PlayerTheme {
    name: string;
    color: string;
}
