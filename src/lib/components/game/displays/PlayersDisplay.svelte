<script lang="ts">
    import PlayersList from '../PlayersList.svelte';

    export let players: any[];
</script>

<div class="display">
    <PlayersList {players} />
</div>

<style>
    .display {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
