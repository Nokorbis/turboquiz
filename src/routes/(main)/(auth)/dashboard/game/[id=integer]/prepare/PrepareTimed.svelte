<script>
	import { faPlus } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa/src/fa.svelte";

    export let supabase;
    export let game;

    let gameThemes$ = loadThemes();

    function loadThemes() {
        return supabase.from('timed_theme')
            .select('id, name, is_mystery, questions:timed_question(*)')
            .eq('game_id', game.id);
    }
</script>

<div class="page">
    <div class="card bg-white p-4">
        <p class="font-bold">Thèmes : <button class="btn-icon btn-icon-sm variant-filled"><Fa icon={faPlus}/></button></p>
        {#await gameThemes$}
            Chargement des thèmes
        {:then {data: gameThemes, error}} 
            {#if error}
                {error.message}
            {:else}
            <ul>
                {#each gameThemes as theme}
                    <li>{JSON.stringify(theme)}</li>
                {:else}
                    Aucun thème n'a été trouvé
                {/each}
            </ul>
            {/if}
        {/await}
    </div>
</div>

<style>
    .page {
        width: min(50rem, 100% - 1rem);
        margin-inline: auto;
        @apply my-2;
    }
</style>