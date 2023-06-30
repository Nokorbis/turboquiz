<script lang="ts">
    import PlayerProfile from './PlayerProfile.svelte';

    export let players: any[];
</script>

<ul class="players-list">
    {#each players as player}
        <li>
            <PlayerProfile {player} />
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
</style>
