<script>
	import { toastStore } from "@skeletonlabs/skeleton";

    export let supabase;
    export let alreadyParticipatingPlayers = [];

    let existingPlayers$ = supabase.from('profile').select('*');

</script>

{#await existingPlayers$}
    Chargement des joueurs...
{:then {data: existingPlayers, error}} 
    {#if error}
        Une erreur est survenue lors du chargement des joueurs
    {:else}
        {@const availablePlayers = existingPlayers}
        {#each availablePlayers as player}
            {player.display_name}
        {:else}
            Aucun joueur n'a été trouvé
        {/each}
    {/if}
    
{/await}