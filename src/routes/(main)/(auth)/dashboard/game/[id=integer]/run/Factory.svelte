<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Game } from "$lib/data/supabase/models";
    import { finalizeGameConfiguration } from "$lib/scripts/GameFactory";

    const dispatch = createEventDispatcher();

    export let supabase: SupabaseClient;
    export let game: Game;

    async function reset() {
        try {
            await finalizeGameConfiguration(supabase, game);
        }
        catch (e: any) {
            console.error(e.message);
        }
        
        dispatch("reset");
    }
</script>

<p class="text-center"><button class="btn variant-filled" on:click={reset}>Réinitialiser</button></p>
<p class="mt-2">Réinitialiser la partie reprend les questions, les joueurs et remet les scores à 0.</p>