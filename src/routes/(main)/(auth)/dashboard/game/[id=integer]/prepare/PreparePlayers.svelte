<script>
	import { faPlus } from "@fortawesome/free-solid-svg-icons";
	import { modalStore } from "@skeletonlabs/skeleton";
	import Fa from "svelte-fa/src/fa.svelte";
	import SearchPlayer from "./SearchPlayer.svelte";

    export let supabase;
    export let game;

    let participants$ = supabase.from('game_player').select('id, user_id, profile(*)').eq('game_key', game.access_key);

    function addParticipant(response) {
        if (response) {

        }
    }

    function openAddParticipantModal() {
        const modalComponent = {
            ref: SearchPlayer,
            props: {
                supabase
            }
        };
        modalStore.trigger( {
             type: 'component',
             component: modalComponent,
             response: addParticipant
        });
    }
</script>

<div class="page card bg-white">
    {#await participants$}
        Chargement des participants...
    {:then {data: participants, error}} 
        {#if error}
        Une erreur est survenue lors du chargement des participants
        {:else}
            <div>
                <span class="font-bold">Liste des participants : </span>
                <button class="btn-icon btn-icon-sm variant-filled" on:click={openAddParticipantModal}><Fa icon={faPlus}></Fa></button>
            </div>
            <ul>
            {#each participants as participant}
                <li>{JSON.stringify(participant)}</li>
            {:else}
                Aucun participant n'a été trouvé
            {/each}
            </ul>
        {/if}
    {/await}
</div>


<style>
    .page {
        width: min(100% - 2rem, 64rem);
        margin-block: 1rem;
        margin-inline: auto;
        padding: 1rem;
    }
</style>
