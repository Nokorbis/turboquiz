<script>
	import { writable } from 'svelte/store';
    import { AppRail, AppRailTile } from '@skeletonlabs/skeleton';
    import Fa from 'svelte-fa/src/fa.svelte'
    import { faUsers, faHourglassHalf, faTableCells, faLandMineOn, faForwardStep } from '@fortawesome/free-solid-svg-icons'; 
	import PrepareBuzzer from './PrepareBuzzer.svelte';
	import PreparePlayers from './PreparePlayers.svelte';
	import PrepareTimed from './PrepareTimed.svelte';

    const selectedRail = writable('players');

    /** @type {import('./$types').PageData} */
    export let data;
    const { supabase } = data;
</script>

<div class="grid grid-cols-[auto_1fr] h-full">
    <AppRail selected={selectedRail} active="bg-secondary-active-token">
        <AppRailTile label="Joueurs" value={'players'}><Fa icon={faUsers}></Fa></AppRailTile>
        <AppRailTile label="Chrono" value={'timed'}><Fa icon={faHourglassHalf}></Fa></AppRailTile>
        <AppRailTile label="Grille" value={'grid'}><Fa icon={faTableCells}></Fa></AppRailTile>
        <AppRailTile label="Buzzer" value={'buzzer'}><Fa icon={faLandMineOn}></Fa></AppRailTile>
        <svelte:fragment slot="trail">
            <AppRailTile label="Démarrer" value={'run'}><Fa icon={faForwardStep}></Fa></AppRailTile>
        </svelte:fragment>
    </AppRail>
    <div>
        {#await data.streamed.game$}
            <p class="text-center">Chargement de la session</p>
        {:then { data: games, error }}
            {#if error || !games}
                Une erreur est survenue durant le chargement de la session
            {:else}
                {@const game = games[0]}
                {#if $selectedRail == 'players'}
                    <PreparePlayers {supabase} {game} />
                {:else if $selectedRail == 'buzzer'}
                    <PrepareBuzzer />
                {:else if $selectedRail == 'timed'}
                    <PrepareTimed {supabase} {game}/>
                {/if}
            {/if}
        {/await}
    </div>
</div>




