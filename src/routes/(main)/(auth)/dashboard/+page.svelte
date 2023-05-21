<script lang="ts">
    import type { PageData } from './$types';
	import type GameSession from '$lib/scripts/models/GameSession';
	import { goto } from '$app/navigation';
    import { modalStore, toastStore } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faPlus } from '@fortawesome/free-solid-svg-icons'; 
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import GameCreator from '$lib/components/GameCreator.svelte';
    
    export let data: PageData;

    const { supabase } = data;
    const games$ = supabase.from('game').select('*').order('game_date', { ascending: false }).limit(10);

    async function openGameCreationModal() {
        const modalComponent = {
            ref: GameCreator
        };
        modalStore.trigger( {
             type: 'component',
             component: modalComponent,
             response: createGame
        });
    }

    async function createGame(response: GameSession | null) {
        if (response) {
            const {data: newGameSessions, error} = await supabase.from('game')
                .insert([{name: response.name, game_date: response.game_date}])
                .select('*');

            if (error) {
                console.error({error});
                toastStore.trigger( {
                    message: error.message,
                    background: 'variant-filled-error'
                } );
            }
            else {
                const gameSession = newGameSessions[0];
                if (gameSession) {
                    modalStore.close();
                    goto(`/dashboard/game/${gameSession.id}/prepare`);
                }
                else {
                    toastStore.trigger( {
                        message: 'Une erreur est survenue lors de la création',
                        background: 'variant-filled-error'
                    } );
                }
            }
        }
        
    }
</script>


<div class="screen-center">
    {#await games$}
        <ProgressRadial class="mx-auto"></ProgressRadial>
    {:then { data: games, error }}
        {#if error}
            {error.message}
        {:else}
            <div class="sessions">
                <p>Sessions exisantes : 
                    <button type="button" 
                        on:click={openGameCreationModal}
                        class="btn-icon btn-icon-sm variant-filled">
                        <Fa icon={faPlus}></Fa>
                    </button>
                </p>
                {#if games}
                    <ul>
                        {#each games as game}
                            <li>
                                <a href="/dashboard/game/{game.id}/prepare">
                                    <span class="game-date">{game.game_date}</span> : {game.name}
                                </a>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <p>Aucune session trouvée</p>
                {/if}
            </div>
        {/if}
    {/await}
</div>

<style>
    .screen-center {
        width: min(38rem, 100% - 1rem);
        margin-inline: auto;
        padding: 1rem;
    }

    .sessions ul {
        padding-inline: 0;
        margin-block: 0;
    }

    .sessions li {
        list-style: none;
    }

    .game-date {
        font-weight: bold;
    }

    a {
        color: var(--turbo-darkgray);
    }
</style>