<script lang="ts">
	import type { Game, GridGame } from "$lib/data/supabase/models";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "$lib/data/supabase/types";
	import { toastStore } from "@skeletonlabs/skeleton";
	import GridGameSettingsEditor from "./GridGameSettingsEditor.svelte";

    export let supabase: SupabaseClient<Database>;
    export let game: Game;

    let gridGame$ = loadGridGame();

    function loadGridGame() {
        return supabase.from('grid_game')
            .select('*')
            .eq('id', game.id)
            .limit(1).single();
    }

    // function slowLoadGridGame() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             loadGridGame().then(resolve)
    //         }, 10000);
    //     });
        
    // }

    async function onSave(event: CustomEvent<{data: {game: GridGame}}>) {
        const gridGame = event.detail.data.game;
        const {data, error} = await supabase.from('grid_game')
                .update({points_theme_self: gridGame.points_theme_self, 
                        points_theme_others: gridGame.points_theme_others})
                .eq('id', gridGame.id);

        if (error) {
            toastStore.trigger({
                message: error.message
            });
        }
        gridGame$ = loadGridGame();
    }

    

</script>

{#await gridGame$}
    <div class="card bg-white p-4">
        <div class="grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-1">
            <div class="placeholder animate-pulse"></div>
            <div class="placeholder animate-pulse"></div>
            <div class="placeholder animate-pulse"></div>
            <div class="placeholder animate-pulse"></div>
            <div class="placeholder animate-pulse"></div>
        </div>
    </div>
{:then {data: gridGame, error}}
    {#if error || !gridGame}
        Une erreur est survenue lors du chargement de la configuration
    {:else}
        <GridGameSettingsEditor {gridGame} on:save={onSave}/>
    {/if}
{/await}


