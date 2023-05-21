<script lang="ts">
	import type { Database } from "$lib/data/supabase/types";
	import type { SupabaseClient } from "@supabase/supabase-js";

    export let supabase: SupabaseClient<Database>;
    export let gameId: number;

    const game$ = supabase.from('game').select('*').eq('id', gameId).limit(1).single();
</script>

{#await game$}
    <p class="text-center">Chargement de la session</p>
{:then { data: game, error }}
    {#if error}
        Une erreur est survenue durant le chargement de la session
    {:else if !game}
        Aucune session n'a été trouvée
    {:else}
        <slot game={game}></slot>
    {/if}
{/await}