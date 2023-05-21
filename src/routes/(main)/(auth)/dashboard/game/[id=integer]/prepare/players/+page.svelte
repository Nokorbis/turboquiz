<script lang="ts">
    import GameLoader from '../GameLoader.svelte';
    import type { PageData } from './$types';
	import ParticipantManagement from './ParticipantManagement.svelte';
    
    export let data: PageData;
    const {supabase} = data;
</script>

<GameLoader 
    {supabase} 
    gameId={data.gameId} 
    let:game={game}
    >
    {#if game}
        <ParticipantManagement {supabase} {game} />
    {/if}
</GameLoader>