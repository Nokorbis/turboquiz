<script lang="ts">
	import type { Game } from "$lib/data/supabase/models";

    export let baseUrl: string;
    export let game: Game;

    $: streamUrl = `${baseUrl}/stream/${game.id}`;
    $: playUrl = `${baseUrl}/play/${game.access_key}`;
    $: runUrl = `${baseUrl}/dashboard/game/${game.id}/run`;

</script>

<div class="card bg-white p-4">
    <div class="bg-black text-white p-2 mb-2">
        {runUrl}
    </div>
    <div class="bg-black text-white p-2 mb-2">
        {streamUrl}
    </div>
    <div class="bg-black text-white p-2">
        {playUrl}
    </div>
</div>