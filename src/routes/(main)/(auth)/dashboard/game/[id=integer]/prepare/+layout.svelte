<script lang="ts">
    import { page } from '$app/stores';
    import { derived } from 'svelte/store';
    import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faUsers, faHourglassHalf, faTableCells, faLandMineOn, faForwardStep } from '@fortawesome/free-solid-svg-icons'; 
    
    const selected = derived(page, $page => $page.url.pathname);
    const gameId = $page.params.id;
</script>

<div class="grid grid-cols-[auto_1fr] h-full">
    <AppRail {selected} active="bg-secondary-active-token">
        <AppRailTile label="Joueurs" href={`/dashboard/game/${gameId}/prepare/players`}><Fa icon={faUsers}></Fa></AppRailTile>
        <AppRailTile label="Chrono" href={`/dashboard/game/${gameId}/prepare/timed`}><Fa icon={faHourglassHalf}></Fa></AppRailTile>
        <AppRailTile label="Grille" href={`/dashboard/game/${gameId}/prepare/grid`}><Fa icon={faTableCells}></Fa></AppRailTile>
        <AppRailTile label="Buzzer" href={`/dashboard/game/${gameId}/prepare/buzzer`}><Fa icon={faLandMineOn}></Fa></AppRailTile>
        <svelte:fragment slot="trail">
            <AppRailTile label="Démarrer" href={`/dashboard/game/${gameId}/prepare/init`}><Fa icon={faForwardStep}></Fa></AppRailTile>
        </svelte:fragment>
    </AppRail>
    <div>
        <slot />
    </div>
</div>