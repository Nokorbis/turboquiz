<script>
	import { modalStore } from "@skeletonlabs/skeleton";
	import PlayerList from "./PlayerList.svelte";

    export let supabase;
    export let alreadyParticipatingPlayers = [];

    let existingPlayers$ = supabase.from('profile').select('*');
    let selectedPlayer = null;

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
        {#if error}
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
