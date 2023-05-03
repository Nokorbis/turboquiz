<script>
	import { faTrash } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa/src/fa.svelte";

    export let theme;
</script>

<div class="card bg-white p-4 h-64 w-[64rem]">
    <div class="grid grid-cols-[max-content_3fr_max-content_1fr] gap-2 items-center">
        <label class="label" for="theme-name">Nom : </label>
        <input id="theme-name" type="text" class="input" bind:value={theme.name}>
        <label for="mystery-theme">Mystère : </label>
        <input class="checkbox" type="checkbox" bind:checked={theme.is_mystery}>
    </div>
    <div class="mt-4">
        <div class="">
            {#each theme.questions as question, i}
            <div class="input-group input-group-divider grid-cols-[4.5rem_1fr] mt-2">
                <button 
                    class="variant-filled-error"
                    style="justify-content: center;">
                    <Fa icon={faTrash}/>
                </button>
                <input type="text" class="" bind:value={question.statement}>
                <input type="number" 
                    style="min-width: 4rem !important; width: 4.5rem; padding-inline-start: 1.25rem"
                    min=0 max=100 step=1
                    bind:value={question.points_value}
                    title="Points par bonne réponse">
                <input type="text" class="" bind:value={question.answer}>
            </div>
            {/each}
        </div>
    </div>
</div>