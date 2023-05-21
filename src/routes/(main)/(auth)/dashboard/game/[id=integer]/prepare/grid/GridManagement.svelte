<script lang="ts">
	import type { Game } from "$lib/data/supabase/models";
	import type { Database } from "$lib/data/supabase/types";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import GridGameSettings from "./GridGameSettings.svelte";

    export let supabase: SupabaseClient<Database>;
    export let game: Game;

    let gridGame$ = loadGridGame();

    function loadThemes() {
        return supabase.from('grid_theme')
            .select('*, questions:grid_question(*)')
            .eq('game_id', game.id)
            .order('name', {ascending: true})
            .order('points_value', {foreignTable: 'timed_question'})
            .order('id', {foreignTable: 'timed_question'});
    }

    function loadGridGame() {
        return supabase.from('grid_game')
            .select('*')
            .eq('id', game.id)
            .limit(1).single();
    }
</script>

<div class="page">
{#await gridGame$}
    Chargement de la configuration
{:then {data: gridGame, error}}
    {#if error || !gridGame}
        Une erreur est survenue lors du chargement de la configuration
    {:else}
        <GridGameSettings {gridGame}/>
    {/if}
{/await}
</div>
<style>
    .page {
        width: min(50rem, 100% - 1rem);
        margin-inline: auto;
        @apply my-2;
    }
</style>