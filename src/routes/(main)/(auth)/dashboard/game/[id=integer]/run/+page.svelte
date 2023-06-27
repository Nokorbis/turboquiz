<script lang="ts">
    import type { PageData } from './$types';
	import StreamManagement from './StreamManagement.svelte';
    
    export let data: PageData;
    const {supabase} = data;
</script>

{#await data.streamed.game$}
    Chargement de la session
{:then { data: game, error }}
    {#if error || !game}
        Une erreur est survenue durant le chargement de la session
    {:else}
    <StreamManagement {game} {supabase} />
    {/if}
{/await}
