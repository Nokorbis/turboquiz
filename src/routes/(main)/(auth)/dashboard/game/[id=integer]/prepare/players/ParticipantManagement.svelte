<script lang="ts">
	import type { Game, Profile } from "$lib/data/supabase/models";
	import type { Database } from "$lib/data/supabase/types";
	import type { SupabaseClient } from "@supabase/supabase-js";
    import { Avatar, modalStore, toastStore } from "@skeletonlabs/skeleton";
    import SelectPlayerModal from "./SelectPlayerModal.svelte";
    import Fa from "svelte-fa/src/fa.svelte";
    import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";

    export let supabase: SupabaseClient<Database>;
    export let game: Game;

    let participants$ = loadParticipants();

    function loadParticipants() {
        return supabase.from('game_player').select('id, user_id, profile(*)').eq('game_key', game.access_key);
    }

    async function addParticipant(response: Profile|null) {
        if (response) {
            console.log({response})
            const {data: result, error} = await supabase.from('game_player')
                .insert([{user_id: response.user_id, game_key: game.access_key}]);

            if (error) {
                toastStore.trigger({
                    message: error.message,
                    background: 'variant-filled-error'
                });
            }
            else {
                modalStore.close();
                participants$ = loadParticipants();
            }
        }
        else {
            toastStore.trigger({
                message: 'Aucun joueur sélectionné',
                timeout: 2000
            });
        }
    }

    async function removeParticipant(participationId: number) {
        const { data: result, error } = await supabase.from('game_player').delete().eq('id', participationId);
        if (error) {
            toastStore.trigger({
                message: error.message,
                background: 'variant-filled-error'
            });
        }
        else {
            participants$ = loadParticipants();
            toastStore.trigger({
                message: 'Participation supprimée',
                background: 'variant-filled-success',
                timeout: 2500
            });
        }
    }

    function openAddParticipantModal() {
        const modalComponent = {
            ref: SelectPlayerModal,
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
            <ul class="">
            {#each participants as participant}
                {#if participant.profile}
                <li title="{participant.profile.themes}" class="grid grid-cols-[min-content_min-content_max-content] gap-2 items-center mt-1">
                    <button 
                        on:click={() => removeParticipant(participant.id)}
                        class="btn-icon btn-icon-sm variant-filled-error">
                        <Fa icon={faTrash}/>
                    </button>
                    <Avatar src={participant.profile.profile_picture} width="w-8"></Avatar>
                    <span>{participant.profile.display_name}</span>
                </li>
                {/if}
                
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