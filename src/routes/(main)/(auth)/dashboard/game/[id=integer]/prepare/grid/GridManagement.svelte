<script lang="ts">
	import type { Game } from "$lib/data/supabase/models";
	import type { Database } from "$lib/data/supabase/types";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import GridGameSettings from "./GridGameSettings.svelte";
	import GridThemes from "./GridThemes.svelte";

    export let supabase: SupabaseClient<Database>;
    export let game: Game;

    let players$ = loadPlayers();

    function loadPlayers() {
        return supabase.from('game_player')
            .select('*, profile(*)')
            .eq('game_key', game.access_key)
            .order('display_name', {ascending: true, foreignTable: 'profile'});
    }

</script>

<div class="page">
    {#await players$}
        <p class="text-center">Chargement des joueurs</p>
    {:then { data: players, error }}
        {#if error || !players}
            Une erreur est survenue durant le chargement des joueurs
        {:else}
        <GridGameSettings {supabase} {game}/>
        <GridThemes {supabase} {game} {players} />
        {/if}
    {/await}
</div>
<style>
    .page {
        width: min(50rem, 100% - 1rem);
        margin-inline: auto;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        @apply my-2;
    }
</style>