import type { Game } from "$lib/data/supabase/models";
import type { SupabaseClient } from "@supabase/supabase-js";
import { get, writable } from "svelte/store";

let supabase: SupabaseClient | null = null; 
let gameId: number | null = null;
export function initStores(client: SupabaseClient, game: Game) {
    supabase = client;
    gameId = game.id;
}

const playersStore = writable([] as any[]);

function sortPlayers(comparator: (a: any, b: any) => number) {
    updatePlayers(players => {
        players.sort(comparator);
        players.forEach((p, i) => p.displayOrder = i);
        return players;
    });
}

function updatePlayers(updater: (players: any[]) => any[]) {
    try {
        playersStore.update((players) => {
            let copy = [...players];
            copy = updater(copy);
            return copy;
        });
        savePlayers();
    }
    catch (e: any) {
        console.error(e);
    }
}

const savePlayers = debounce(async () => {
    const players = get(playersStore);
    await supabase?.from('running_game').update({ players }).eq('id', gameId);
}, 3000);


export const players$ = {
    subscribe: playersStore.subscribe,
    load: (players: any[]) => {
        players.sort((a, b) => a.displayOrder - b.displayOrder);
        playersStore.set(players);
    },
    update: playersStore.update,
    updateAll: updatePlayers,
    increaseScore: (playerId: number, score: number = 1) => updatePlayers(players => {
        let player = players.find(p => p.id === playerId);
        if (player) {
            player.score += score;
        }
        return players;
    }),
    decreaseScore: (playerId: number, score: number = 1) => updatePlayers(players => {
        let player = players.find(p => p.id === playerId);
        if (player) {
            if (player.score <= 0) {
                throw new Error('Le score du joueur ne peut pas être négatif');
            }
            player.score -= score;
            if (player.score < 0) {
                player.score = 0;
            }
        }
        return players;
    }),
    sort: sortPlayers,
};

function debounce(func: Function, timeout = 300){
    let timer: any;
    return (...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}