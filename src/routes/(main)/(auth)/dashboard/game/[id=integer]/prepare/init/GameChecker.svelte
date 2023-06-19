<script lang="ts">
	import type { Game } from "$lib/data/supabase/models";
	import type { Database } from "$lib/data/supabase/types";
	import type { SupabaseClient } from "@supabase/supabase-js";
    import { loadGridPlayersAndThemes, type PlayerWithThemes } from "$lib/scripts/GameChecker";
	import Fa from "svelte-fa/src/fa.svelte";
	import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

    export let supabase: SupabaseClient<Database>;
    export let game: Game;

    let gridPlayersAndThemes$ = loadGridPlayersAndThemes(supabase, game);

    function allPlayersHaveSameThemesCount(gridPlayersAndThemes: PlayerWithThemes[]) {
        const themesCount = gridPlayersAndThemes[0].themes.length;
        return gridPlayersAndThemes.every(player => player.themes.length === themesCount);
    }
</script>

<div class="card bg-white p-4">
    <!-- <h3 class="text-base">Mode chronométré</h3> -->
    <h3 class="text-base">Mode grille</h3>
    <h4>Joueurs</h4>
    {#await gridPlayersAndThemes$}
        Chargement des joueurs et de leurs thèmes
    {:then {data: gridPlayersAndThemes, error}} 
        {#if error || !gridPlayersAndThemes}
            Une erreur est survenue durant le chargement des joueurs
        {:else}
            {#if !allPlayersHaveSameThemesCount(gridPlayersAndThemes)}
            <p class="text-amber-500">
                <span class="badge-icon inline-flex"><Fa icon={faTriangleExclamation}/></span>
                <span>Les joueurs n'ont pas tous le même nombre de thèmes</span>
            </p>
            {/if}
            <ul>
                {#each gridPlayersAndThemes as player}
                    <li>
                        <span>
                            - {player.display_name}
                        </span>
                        {#if player.themes.length > 0} 
                        <span class="italic">: {player.themes.map(t => t.name).join(', ')}</span>
                        {/if}
                    </li>
                {/each}
            </ul>
        {/if}
    {/await}
</div>