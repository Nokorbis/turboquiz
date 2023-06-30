import type { RealtimeChannel } from "@supabase/supabase-js";

let channel: RealtimeChannel | null = null;
let lastData: any = null;

export const stream = {
    initialize,
    sendLastData,
    sendPlayers,
    showPlayersOnly,
    showPlayersWithThemes
}

function initialize(supabaseChannel: RealtimeChannel) {
    channel = supabaseChannel;
}

function sendPlayers(players: any[]) {
    sendMessage('players', players);
}

function showPlayersOnly() {
    sendView({  
        view: 'players-only'
    });
}

function showPlayersWithThemes() {
    sendView({  
        view: 'players-with-themes'
    });
}

function sendLastData() {
    if (lastData == null){
        lastData = {
            view: 'players'
        }
    }
    sendMessage('view', lastData);
}

function sendView(payload: any) {
    lastData = payload;
    sendMessage('view', payload);
}

function sendMessage(type: string, payload: any) {
    channel!.send({
        type: 'broadcast',
        event: type,
        payload
    });
}