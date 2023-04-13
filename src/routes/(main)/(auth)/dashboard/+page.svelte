<script>
    /** @type {import('./$types').PageData} */
    export let data;
    const { supabase } = data;
    const games$ = supabase.from('game').select('*').order('game_date', { ascending: false }).limit(10);
</script>

<div class="screen-center">
    {#await games$}
        Chargement des sessions existantes...
    {:then { data: games, error }}
        <div class="sessions">
            <p>Sessions exisantes : <button>+</button></p>
            {#if games}
                <ul>
                    {#each games as game}
                        <li>
                            <a href="/dashboard/game/{game.id}">
                                <span class="game-date">{game.game_date}</span> : {game.name}
                            </a>
                        </li>
                    {/each}
                </ul>
            {:else}
                <p>Aucune session trouvée</p>
            {/if}
        </div>
    {/await}
</div>

<style>
    .sessions {
        height: 80%;
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