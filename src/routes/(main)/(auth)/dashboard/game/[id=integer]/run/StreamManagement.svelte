<script lang="ts">
    import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Game } from "$lib/data/supabase/models";
	import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
	import Fa from "svelte-fa";
	import { faDice, faHammer, faHourglassHalf, faTableCells } from "@fortawesome/free-solid-svg-icons";
	import Factory from "./Factory.svelte";
	import { writable } from "svelte/store";

    export let supabase: SupabaseClient;
    export let game: Game;
    export let gameState: any;

    let gameStateChannelStatus : string | null = null;
    const gameStateChannel = supabase.channel('/game-state');
    gameStateChannel.subscribe(status => {
        gameStateChannelStatus = status;
    });

    function sendMessage() {
        // gameStateChannel.send({
        //     type: 'broadcast',
        //     event: 'message',

        //     data: "Hello World!"
        // });
    }

    let currentTab = writable('initiative');
</script>
<div class="grid grid-cols-[auto_1fr] h-full">
    <AppRail selected={currentTab} active="bg-secondary-active-token">
        <AppRailTile label="Initiative" value = "initiative" ><Fa icon={faDice}></Fa></AppRailTile>
        <AppRailTile label="Chrono" value = "chrono"><Fa icon={faHourglassHalf}></Fa></AppRailTile>
        <AppRailTile label="Grille" value = "grid"><Fa icon={faTableCells}></Fa></AppRailTile>
        <svelte:fragment slot="trail">
            <AppRailTile label="Factory" value="factory"><Fa icon={faHammer}></Fa></AppRailTile>
        </svelte:fragment>
    </AppRail>
    <div class="page">
        <div class="card bg-white p-4">
            {#if $currentTab === 'factory'}
                <Factory {supabase} {game} on:reset/>
            {:else}
                {JSON.stringify(gameState)}
                <div>Status Game-Status: {gameStateChannelStatus}</div>
                <button on:click={sendMessage}>Message</button>
            {/if}
        </div>
    </div>
</div>

<style>
    .page {
        @apply my-2;
        width: min(50rem, 100% - 1rem);
        margin-inline: auto;      
    }
</style>



