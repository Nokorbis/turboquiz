<script lang="ts">
    import PlayersWithThemesList from '../PlayersWithThemesList.svelte';

    export let players: any[];
</script>

<div class="display">
    <PlayersWithThemesList {players} />
</div>

<style>
    .display {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
