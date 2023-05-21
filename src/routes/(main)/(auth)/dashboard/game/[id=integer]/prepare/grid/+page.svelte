<script lang="ts">
    import GameLoader from '../GameLoader.svelte';
    import type { PageData } from './$types';
	import GridManagement from './GridManagement.svelte';
    
    export let data: PageData;
    const {supabase} = data;
</script>

<GameLoader 
    {supabase} 
    gameId={data.gameId} 
    let:game={game}
    >
    {#if game}
        <GridManagement {supabase} {game} />
    {/if}
</GameLoader>