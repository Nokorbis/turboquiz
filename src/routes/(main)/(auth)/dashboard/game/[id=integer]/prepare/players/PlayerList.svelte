<script lang="ts">
	import type { Profile } from "$lib/data/supabase/models";
	import type { PaginationSettings } from "@skeletonlabs/skeleton/dist/components/Paginator/types";
    import { faHand, faHandMiddleFinger, faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";
	import { Avatar, ListBox, ListBoxItem, Paginator, popup } from "@skeletonlabs/skeleton";
	import Fa from "svelte-fa/src/fa.svelte";

    export let players: Profile[];
    export let selectedPlayer: Profile | null;

    let textFilter = '';
    let settings: PaginationSettings = {
        offset: 0,
        limit: 10,
        size: 0,
        amounts: [1, 5, 10, 25]
    }

    $: filteredPlayers = filterPlayers(players, textFilter);
    $: { settings.size = filteredPlayers.length };
    $: availablePlayers = sortPlayers(settings, filteredPlayers);

    function filterPlayers(players: Profile[], textFilter: string): Profile[] {
        textFilter = textFilter.trim().toLowerCase();
        const filteredPlayers = players.filter(p => {
            return p.display_name.toLowerCase().includes(textFilter) || p.themes.toLowerCase().includes(textFilter);
        });

        return filteredPlayers;
    }

    function sortPlayers(settings: PaginationSettings, players: Profile[]): Profile[] {
        const sortedPlayers = players;
        const pagePlayers = sortedPlayers.slice(settings.offset, settings.offset + settings.limit);
        return pagePlayers;
    }

</script>

<input type="text" class="input bg-white" bind:value={textFilter} placeholder="Filtrer...">
<ListBox class="my-3">
    {#each availablePlayers as player}
        <div class="card bg-white w-[160px] overflow-hidden drop-shadow" data-popup="player-{player.user_id}">
            <header>
                <img src="{player.profile_picture}" alt="">
            </header>
            <div class="card-content p-1">
                <ul class="">
                    <li>- Niveau estimé : {player.culture_level}/5</li>
                    <li>- Thèmes : {player.themes}</li>
                    <li>-
                        {#if player.has_microphone}
                        A un micro
                        {:else}
                        N'a pas de micro
                        {/if}
                    </li>
                    <li>-
                        {#if player.wants_to_play}
                        Veut Jouer
                        {:else}
                        Ne veut pas jouer
                        {/if}
                    </li>
                </ul>
            </div>
            <hr class="opacity-50">
            <footer class="p-2">
                {player.display_name}
            </footer>
        </div>
        <ListBoxItem bind:group={selectedPlayer} name="player" value={player} class="items-center">
            <svelte:fragment slot="lead">
                <Avatar src={player.profile_picture} width="w-6"/>
            </svelte:fragment>
            <div class="self-center" use:popup={{
                event: 'hover', 
                target: `player-${player.user_id}`, 
                placement: 'top', 
                middleware: {
                    offset: 25
                }
                }}>
                <span >{player.display_name}</span>
            </div>
            <svelte:fragment slot="trail">
                {#if player.has_microphone}
                    <span class="inline-flex badge-icon variant-filled-success">
                        <Fa icon={faMicrophone}></Fa>
                    </span>
                {:else}
                    <span class="inline-flex badge-icon variant-filled-error">
                        <Fa icon={faMicrophoneSlash}></Fa>
                    </span>
                {/if}
                {#if player.wants_to_play}
                    <span class="inline-flex badge-icon variant-filled-success">
                        <Fa icon={faHand}></Fa>
                    </span>
                {:else}
                    <span class="inline-flex badge-icon variant-filled-error">
                        <Fa icon={faHandMiddleFinger}></Fa>
                    </span>
                {/if}
            </svelte:fragment>
        </ListBoxItem>
    {:else}
        Aucun joueur n'a été trouvé
    {/each}
</ListBox>
<Paginator bind:settings amountText="joueurs"/>