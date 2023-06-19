<script lang="ts">
	import GameLoader from '../GameLoader.svelte';
    import type { PageData } from './$types';
	import GameChecker from './GameChecker.svelte';
    
    export let data: PageData;
    let { supabase } = data;

</script>
<div class="page">
<GameLoader 
    {supabase} 
    gameId={data.gameId} 
    let:game={game}
    >
    {#if game}
        <GameChecker {supabase} {game} />
    {/if}
</GameLoader>

    
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
