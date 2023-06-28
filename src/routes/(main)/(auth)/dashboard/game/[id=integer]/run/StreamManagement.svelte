<script lang="ts">
    import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Game } from "$lib/data/supabase/models";
	import { AppRail, AppRailTile } from "@skeletonlabs/skeleton";
	import Fa from "svelte-fa";
	import { faDice, faHammer, faHourglassHalf, faTableCells } from "@fortawesome/free-solid-svg-icons";

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

    let currentTab = 'initiative';
</script>
<div class="grid grid-cols-[auto_1fr] h-full">
    <AppRail active="bg-secondary-active-token">
        <AppRailTile bind:group={currentTab} label="Initiative" value = "initiative" ><Fa icon={faDice}></Fa></AppRailTile>
        <AppRailTile bind:group={currentTab} label="Chrono" value = "chrono"><Fa icon={faHourglassHalf}></Fa></AppRailTile>
        <AppRailTile bind:group={currentTab} label="Grille" value = "grid"><Fa icon={faTableCells}></Fa></AppRailTile>
        <svelte:fragment slot="trail">
            <AppRailTile bind:group={currentTab} label="Factory" value="factory"><Fa icon={faHammer}></Fa></AppRailTile>
        </svelte:fragment>
    </AppRail>
    <div>
        {JSON.stringify(gameState)}
        <div>Status Game-Status: {gameStateChannelStatus}</div>
        <button on:click={sendMessage}>Message</button>
    </div>
</div>



