<script lang="ts">
	import GameDisplay from '$lib/components/game/displays/GameDisplay.svelte';
    import type { PageData } from './$types';

    export let data: PageData;
    const {supabase, streamed} = data;
    const game$ = streamed.game$;
</script>

{#await game$}
    <div class="screen-center">Chargement de la partie...</div>
{:then {data: game, error}}
    {#if error || !game}
        <div class="screen-center">Une erreur est survenue durant le chargement de la partie</div>
    {:else}
        <GameDisplay {supabase} {game}/>
    {/if}
{/await}

<style>
    .screen-center  {
        display: grid;
        height: 100%;
        place-items: center;
    }
</style>

