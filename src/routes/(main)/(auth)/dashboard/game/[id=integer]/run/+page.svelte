<script>
    /** @type {import('./$types').PageData} */
    export let data;
</script>

{#await data.streamed.game$}
    Chargement de la session
{:then { data: games, error }}
    {#if error || !games}
        Une erreur est survenue durant le chargement de la session
    {:else}
        {@const game = games[0]}
        {game.access_key}
    {/if}
{/await}
