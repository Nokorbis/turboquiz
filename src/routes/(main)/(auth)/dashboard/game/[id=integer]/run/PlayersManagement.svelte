<script lang="ts">

    import { players$ } from "$lib/scripts/StateManager";
    import { stream } from "$lib/scripts/StreamControl";
	import { faLightbulb, faStar, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

    function changeHighlight(playerId: number, hightlight: boolean) {
        players$.updateAll((players) => {
            players.forEach((player) => {
                if (player.id === playerId) {
                    player.highlight = hightlight;
                }
                else {
                    player.highlight = false;
                }
            });
            return players;
        });
    }

</script>

<div>
    <div class="flex justify-around">
        <span class="btn-icon variant-filled cursor-pointer" 
            on:click={() => stream.showPlayersOnly()}
            title="Afficher les joueurs">
            <Fa icon={faUsersViewfinder}/>
        </span>
        <span class="btn-icon variant-filled cursor-pointer"
            on:click={() => stream.showPlayersWithThemes()}
            title="Afficher les joueurs et leurs thèmes">
            <Fa icon={faStar}/>
        </span>
    </div>
    <hr class="my-3">
    <table class="players-table">
        <thead>
            <tr>
                <th><Fa icon={faLightbulb}/></th>
                <th>Pseudo</th>
                <th>Initiative</th>
                <th>Score</th>
            </tr>
        </thead>
        <tbody>
            {#each $players$ as player}
            {#key player.id}
                <tr>
                    <td>
                        {#if player.highlight}
                        <span class="cursor-pointer" on:click={() => changeHighlight(player.id, false)}><Fa icon={faLightbulb} color="gold"/></span>
                        {:else}
                        <span class="cursor-pointer" on:click={() => changeHighlight(player.id, true)}><Fa icon={faLightbulb} color="lightgrey"/></span>                            
                        {/if}
                    </td>
                    <td>{player.name}</td>
                    <td>{player.initiativeOrder}({player.initiative ?? '?'})</td>
                    <td>
                        <div class="input-group input-group-divider grid-cols-[3fr_3fr_3fr] w-[8rem] mx-auto">
                            <button class="variant-filled-tertiary" on:click={() => players$.decreaseScore(player.id)}>-</button>
                            <span>{player.score}</span>
                            <button class="variant-filled-tertiary" on:click={() => players$.increaseScore(player.id)}>+</button>
                        </div>
                    </td>
                </tr>
                {/key}
            {/each}
        </tbody>
    </table>
</div>


<style>
    .players-table {
        width: 100%;
    }

    .players-table th {
        text-align: center;
    }

    .players-table > tbody > tr > td:not(:nth-child(2)) {
        text-align: center;
    }
</style>