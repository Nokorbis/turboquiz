<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

{#await data.streamed.game$}
    Chargement de la session
{:then { data: game, error }}
    {#if error || !game}
        Une erreur est survenue durant le chargement de la session
    {:else}
        {game.access_key}
    {/if}
{/await}
