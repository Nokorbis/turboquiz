<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";
	import PlayersDisplay from "./PlayersDisplay.svelte";
	import PlayersWithThemesDisplay from "./PlayersWithThemesDisplay.svelte";

    export let supabase: SupabaseClient;
    export let game: { access_key: string };

    let players: any[] = [];
    let mode = 'players-only';

    const gameChannel = supabase.channel(`${game.access_key}/game-state`);
    const playerChannel = supabase.channel(`${game.access_key}/player-state`);

    gameChannel
    .on('broadcast', {event: 'players' }, ({payload}) => {
        console.log({payload});
        players = payload;
    })
    .on('broadcast', {event: 'view' }, ({payload}) => {
        console.log({payload});
        handleView(payload.view, payload.data);
    })
    .subscribe(status => {
        if (!['SUBSCRIBED', 'CLOSED'].includes(status)) {
            alert('Impossible de se mettre en écoute de la partie. Veuillez rafraichir la page (' + status + ')');
        }
    });
    
    playerChannel.subscribe(status => {
        if (!['SUBSCRIBED', 'CLOSED'].includes(status)) {
            alert('Impossible de se synchroniser avec la partie. Veuillez rafraichir la page (' + status + ')');
        }
    });
    playerChannel.send({type: 'broadcast', event: 'join', payload: []});

    function handleView(view: string, data: any) {
        const handler = handlers[view];
        if (handler) {
            handler(view, data);
        } 
        else {
            console.error('Unknown view: ' + view);
        }
    }

    function defaultHandler(view: string) {
        reset();
        mode = view;
    }

    const handlers: {[key: string]: Function} = {
        'players-only': defaultHandler,
        'players-with-themes': defaultHandler
    };

    function reset() {
        mode = '';
    }
</script>

{#if mode == 'players-with-themes'}
    <PlayersWithThemesDisplay {players}/>
{:else}
    <PlayersDisplay {players}/>
{/if}
