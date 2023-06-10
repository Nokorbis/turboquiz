<script lang=ts>
	import type { GridGame } from "$lib/data/supabase/models";
	import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    const personalExplain = 'Points remportés lorsqu\'on répond à une question de son propre thème';
    const opponentExplain = 'Points remportés lorsqu\'on répond à une question d\'un thème adverse';

    export let gridGame: GridGame;

    function save() {
        dispatch('save', gridGame);
    }
</script>

<div class="card bg-white p-4">
    <div class="grid 
    grid-cols-[1fr]
    md:grid-cols-[max-content_1fr]
    lg:grid-cols-[max-content_1fr_max-content_1fr_max-content] 
    items-center gap-4">
        <div class="md:text-right">
            <label for="personal-points-value" title={personalExplain}>Points personnels : </label>
        </div>
        <div>
            <input type="number" class="input" id="personal-points-value"
            min="0" max="999" step="1"
            value={gridGame.points_theme_self}
            title={personalExplain}>
        </div>
        <div class="md:text-right">
            <label for="opponents-points-value" title={opponentExplain}>Points ennemis :</label>
        </div>
        <div>
            <input type="number" class="input" id="opponents-points-value" 
            min="0" max="999" step="1"
            value={gridGame.points_theme_others}
            title={opponentExplain}>
        </div>
        <div class="col-span-1 md:col-span-2 lg:col-span-1 text-right">
            <button class="btn variant-filled-primary" on:click={save}>Sauvegarder</button>
        </div>
    </div>
</div>