<script lang="ts">
    import type { PageData } from './$types';
	import Finalizer from './Finalizer.svelte';
	import StreamManagement from './StreamManagement.svelte';
    
    export let data: PageData;
    const {supabase} = data;
</script>

<svelte:head>
    <title>TurboQuizz - Control Center</title>
</svelte:head>

{#await data.streamed.game$}
    Chargement de la session
{:then { data: game, error }}
    {#if error || !game}
        Une erreur est survenue durant le chargement de la session
    {:else}
    <Finalizer {game} {supabase} let:gameState>
        <StreamManagement {game} {supabase} {gameState}/>
    </Finalizer>
    
    {/if}
{/await}
