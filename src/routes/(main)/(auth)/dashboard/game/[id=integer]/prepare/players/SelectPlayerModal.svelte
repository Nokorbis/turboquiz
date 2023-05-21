<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "$lib/data/supabase/types";
	import type { Profile } from "$lib/data/supabase/models";
	import { modalStore } from "@skeletonlabs/skeleton";
	import PlayerList from "./PlayerList.svelte";

    export let supabase: SupabaseClient<Database>;
    export let alreadyParticipatingPlayers: Profile[] = [];

    let existingPlayers$ = supabase.from('profile').select('*');
    let selectedPlayer: Profile | null  = null;

    function selectPlayer() {
        if ($modalStore[0]?.response) {
            $modalStore[0].response(selectedPlayer);
        }
    }
</script>

<div class="card bg-white p-4 w-[400px]">
    {#await existingPlayers$}
        Chargement des joueurs...
    {:then {data: existingPlayers, error}} 
        {#if error || !existingPlayers}
            Une erreur est survenue lors du chargement des joueurs
        {:else}
            <PlayerList players={existingPlayers} bind:selectedPlayer={selectedPlayer} />
            <div class="text-right mt-2">
                <button class="btn variant-filled" 
                    disabled={selectedPlayer == null}
                    on:click={selectPlayer}
                    >Choisir
                </button>
            </div>
        {/if}
    {/await}
</div>
