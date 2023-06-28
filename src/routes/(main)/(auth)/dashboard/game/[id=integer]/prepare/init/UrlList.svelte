<script lang="ts">
	import type { Game } from "$lib/data/supabase/models";
	import { toastStore } from "@skeletonlabs/skeleton";

    export let baseUrl: string;
    export let game: Game;

    $: streamUrl = `${baseUrl}/stream/${game.id}`;
    $: playUrl = `${baseUrl}/play/${game.access_key}`;
    $: runUrl = `${baseUrl}/dashboard/game/${game.id}/run`;

    function copyUrl(url: string) {
        navigator.clipboard.writeText(url);
        toastStore.trigger({
            message: `URL copiée`,
            background: "variant-filled-success",
            timeout: 1000
        });
    }

</script>

<div class="card bg-white p-4">
    <div class="flex justify-between w-full">
        <span>
            <button on:click={() => copyUrl(runUrl)}>Copier l'url de la page de contrôle</button>
        </span>
        <span>
            <a href="{runUrl}" target="_blank">Ouvrir la page de contrôle</a>
        </span>
    </div>
    <div class="flex justify-between w-full">
        <span>
            <button on:click={() => copyUrl(streamUrl)}>Copier l'url du stream</button>
        </span>
        <span>
            <a href="{streamUrl}" target="_blank">Ouvrir la page de stream</a>
        </span>
    </div>
    <div class="flex justify-between w-full">
        <span>
            <button on:click={() => copyUrl(playUrl)}>Copier l'url de la page des joueurs</button>
        </span>
        <span>
            <a href="{playUrl}" target="_blank">Ouvrir la page des joueurs</a>
        </span>
    </div>
</div>