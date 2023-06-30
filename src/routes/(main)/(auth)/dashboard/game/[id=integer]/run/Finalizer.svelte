<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Game, RunningGame } from "$lib/data/supabase/models";
    import { finalizeGameConfiguration } from "$lib/scripts/GameFactory";
	import { toastStore } from "@skeletonlabs/skeleton";
	import StreamManagement from "./StreamManagement.svelte";

    export let supabase: SupabaseClient;
    export let game: Game;

    let gameState$ = loadGameState();

    async function loadGameState() {

        return await supabase.from('running_game')
            .select('*')
            .eq('id', game.id)
            .then(({ data, error }) => {

                if (error) {
                    return {data: null, error};
                }

                if (data.length === 0) {
                    return {data: null, error: null};
                }

                return {data: data[0] as RunningGame, error: null};
            });
    }

    async function finalize() {

        try {
            await finalizeGameConfiguration(supabase, game);
        }
        catch (error: any) {
            toastStore.trigger({
                message: error.message,
                background: "variant-filled-error",
                autohide: false
            });
        }
        gameState$ = loadGameState();
    }
</script>

{#await gameState$}
    Chargement de la partie
{:then {data: gameState, error}} 
    {#if error}
        Une erreur est survenue durant le chargement de la partie : {error.message}
    {:else if gameState == null}
        <div class="page bg-white card p-4">
            <p>La configuration de la partie n'a pas été finalisée.</p>
            <p>Si vous souhaitez la finaliser, cliquez sur le bouton ci-dessous.</p>
            <p class="text-center my-2"><button class="btn variant-filled" on:click={finalize}>Finaliser</button></p>
            <p class="bold">Qu'est-ce que cela signifie de finaliser la partie ? </p>
            <p>Les joueurs et les différentes questions sont consolidées dans un "état" et préparés pour pouvoir être utilisés en live. Cela signifie qu'ajouter ou supprimer des questions ne changera pas cet état après la finalisation. Il est toutefois possible de réinitialiser cet état plus tard, depuis le bouton "Factory", et ainsi remettre, par exemple, le score des joueurs à 0 (ou ajouter un joueur ou une question manquante).</p>
        </div>
    {:else}
        <StreamManagement {game} {supabase} {gameState} on:reset={() => gameState$ = loadGameState()}/>
    {/if}
{/await}

<style>
    .page {
        @apply my-2;
        width: min(50rem, 100% - 1rem);
        margin-inline: auto;      
    }
</style>