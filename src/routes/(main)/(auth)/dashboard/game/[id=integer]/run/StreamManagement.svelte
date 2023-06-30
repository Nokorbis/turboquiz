<script lang="ts">
	import { get, writable } from "svelte/store";
	import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
    import type { SupabaseClient } from "@supabase/supabase-js";
	import Fa from "svelte-fa";
	import { faDice, faHammer, faHourglassHalf, faTableCells } from "@fortawesome/free-solid-svg-icons";
	import Factory from "./Factory.svelte";
	import type { Game, RunningGame } from "$lib/data/supabase/models";
    import { initStores, players$ } from "$lib/scripts/StateManager";
    import { stream } from "$lib/scripts/StreamControl";
	import PlayersManagement from "./PlayersManagement.svelte";

    export let supabase: SupabaseClient;
    export let game: Game;
    export let gameState: RunningGame;


    const gameStateChannel = supabase.channel(`${game.access_key}/game-state`);
    gameStateChannel.subscribe(status => {
        if (!['SUBSCRIBED', 'CLOSED'].includes(status)) {
            alert('Impossible d\'envoyer les données de la partie. Veuillez rafraichir la page (' + status + ')');
        }
    });
    stream.initialize(gameStateChannel);

    const playerChannel = supabase.channel(`${game.access_key}/player-state`);
    playerChannel.on('broadcast', {event: 'join'}, (_) => {
        console.log('Joined');
        stream.sendPlayers(get(players$));
        stream.sendLastData();
    })
    .subscribe(status => {
        if (!['SUBSCRIBED', 'CLOSED'].includes(status)) {
            alert('Impossible de recevoir les données des joueurs. Veuillez rafraichir la page (' + status + ')');
        }
    });

    initStores(supabase, game);
    players$.load(gameState.players as any[]);
    players$.subscribe((players) => {
        stream.sendPlayers(players);
    });

    let currentTab = writable('initiative');
</script>
<div class="grid grid-cols-[auto_1fr] h-full overflow-y-hidden">
    <AppRail selected={currentTab} active="bg-secondary-active-token">
        <AppRailTile label="Initiative" value = "initiative" ><Fa icon={faDice}></Fa></AppRailTile>
        <AppRailTile label="Chrono" value = "chrono"><Fa icon={faHourglassHalf}></Fa></AppRailTile>
        <AppRailTile label="Grille" value = "grid"><Fa icon={faTableCells}></Fa></AppRailTile>
        <svelte:fragment slot="trail">
            <AppRailTile label="Factory" value="factory"><Fa icon={faHammer}></Fa></AppRailTile>
        </svelte:fragment>
    </AppRail>
    <div class="overflow-y-auto overflow-x-hidden">
        {#if $currentTab === 'factory'}
            <Factory {supabase} {game} on:reset/>
        {:else}
            <div class="control-grid h-full">
                <div>
                    <div class="m-2 card bg-white p-4 ">
                        <PlayersManagement/>
                    </div>
                </div>
                <div class="game-control">
                    <div class="m-2 card bg-white p-4">
                        <!-- TODO -->
                    </div>
                </div>
                <div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .control-grid {
        display: grid;
        grid-template-columns: 2fr 3fr;
        grid-template-rows: 1fr auto;
    }

    .game-control {
        grid-row: span 2;
    }
</style>



