<script lang="ts">
    import PlayerProfile from './PlayerProfile.svelte';

    export let players: any[];
</script>

<ul class="players-list">
    {#each players as player}
        <li>
            <PlayerProfile {player} />
            {#each player.themes as theme}
            <div class="player-theme" style="--player-theme-color:{theme.color};">
                {theme.name}
            </div>
            {/each}
        </li>
    {/each}
</ul>

<style>
    .players-list {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
    }

    .players-list li {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .player-theme {
        width: 230px;
        height: 53px;
        border-radius: 0.5rem;
        background-color: var(--player-theme-color, #2d3142);

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
