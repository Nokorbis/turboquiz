<script lang="ts">
	import GameLoader from '../GameLoader.svelte';
    import type { PageData } from './$types';
	import Explanation from './Explanation.svelte';
	import GameChecker from './GameChecker.svelte';
	import UrlList from './UrlList.svelte';
    
    export let data: PageData;
    let { supabase, baseUrl } = data;

</script>

<div class="page">
<GameLoader 
    {supabase} 
    gameId={data.gameId} 
    let:game={game}
    >
    {#if game}
        <UrlList {baseUrl} {game} />
        <Explanation />
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
