<script lang="ts">
	import { tick } from "svelte";
    import { modalStore, toastStore } from "@skeletonlabs/skeleton";
	import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import { newGridQuestion } from "$lib/scripts/ModelFactory";
	import type { GamePlayerWithProfile, GridQuestion, GridThemeWithQuestionsU } from "$lib/data/supabase/models";

    export let theme: GridThemeWithQuestionsU;
    export let players: GamePlayerWithProfile[];
    
    let saving = false;
    let deletedQuestions: GridQuestion[] = [];
    let scrollablePane: HTMLDivElement;

    let isPlayerTheme: boolean = !theme.id || !!theme.owner_id;
    let themeValuePoints: number = theme.questions[0]?.points_value || 5;

    function onPlayerModeChange() {
        if (!isPlayerTheme) {
            theme.owner_id = null;
        }
    }

    function saveTheme() {
        if ($modalStore[0]?.response) {
            try {
                validate();
                cleanTheme();
                saving = true;
                $modalStore[0].response({theme, deletedQuestions, processEnd: () => saving = false});
            }
            catch (error: any) {
                toastStore.trigger({
                    message: error.message,
                    background: 'variant-filled-error'
                });
                return;
            }
            
        }
    }

    function addQuestion() {
        theme.questions = [...theme.questions, 
        newGridQuestion()
        ];
        tick().then(() => {
            scrollablePane.scrollTop = scrollablePane.scrollTopMax || scrollablePane.scrollHeight;
        });   
    }

    function deleteQuestion(index: number) {
        let qs = [...theme.questions];
        let oldQuestion = qs[index];
        if (oldQuestion) {
            qs = qs.filter((v, i) => {
                return i != index;
            });
            if (oldQuestion.id) {
                deletedQuestions = [
                    ...deletedQuestions.filter((dq) => {
                        return dq.id != oldQuestion.id
                    }),
                    oldQuestion as GridQuestion
                ];
            }
            theme.questions = qs;
        }   
    }

    function validate() {
        theme.name = theme.name?.trim();
        theme.color = theme.color?.trim();
        if (!theme.name) {
            throw new Error("Le nom du thème ne peut pas être vide");
        }
        if (theme.questions.length == 0) {
            throw new Error("Le thème doit contenir au moins une question");
        }
        if (!theme.color) {
            throw new Error("La couleur du thème ne peut pas être vide");
        }
        if (isPlayerTheme && !theme.owner_id) {
            throw new Error("Le thème doit être associé à un joueur");
        }

        theme.questions.forEach((q, i) => {
            q.statement = q.statement?.trim();
            q.answer = q.answer?.trim();
            if (!q.statement && q.answer) {
                throw new Error(`La question ${i+1} ne peut pas être vide`);
            }
            if (!q.answer && q.statement) {
                throw new Error(`La réponse de la question ${i+1} ne peut pas être vide`);
            }
        });
    }

    function cleanTheme() {
        let toDelete: number[] = [];
        theme.questions.forEach((q, i) => {
            if (q.statement || q.answer) {
                q.points_value = themeValuePoints;
            }
            else {
                toDelete.push(i);
            }
        });
        toDelete.sort((a, b) => {
            return b - a;
        });
        toDelete.forEach(deleteQuestion);
    }

    const tooltipPoints = `Nombre de points gagnés pour chaque question de ce thème`;
</script>

<div class="card bg-white p-4 h-[calc(100%-4rem)] w-[64rem]">
    <div class="flex flex-col h-full gap-2">
        <div class="grid grid-cols-[max-content_max-content_max-content_3fr] gap-2 items-center">
            <label for="mystery-theme">Couleur : </label>
            <input class="input" type="color" bind:value={theme.color}>
            <label class="label" for="theme-name">Nom : </label>
            <input id="theme-name" type="text" class="input" bind:value={theme.name}>
        </div>
        <div class="grid grid-cols-[max-content_max-content_1fr] gap-2 items-center h-[3rem]">
            <div>
                <label for="is-player-theme" class="label">Thème joueur : </label>
                <input type="checkbox" id="is-player-theme" class="checkbox" bind:checked={isPlayerTheme} on:change={onPlayerModeChange}>
            </div>
            <div class="divider-vertical"></div>
            {#if isPlayerTheme}
                <div>
                    <select name="" id="" class="select" bind:value={theme.owner_id}>
                        {#each players as player}
                            <option value={player.profile.user_id}>{player.profile.display_name}</option>
                        {/each}
                    </select>
                </div>
            {:else}
                <div class="grid grid-cols-[max-content_1fr] gap-2 items-center">
                    <label for="grid-theme-value-points" class="label flex-grow" title={tooltipPoints}>Points : </label>
                    <input type="number" id="grid-theme-value-points" class="input input-sm flex-shrink" bind:value={themeValuePoints} min=1 max=999 step=1 title={tooltipPoints}>
                </div>
            {/if}
        </div>
        <div class="">
            <span class="text-lg">Questions : ({theme.questions.length})</span>
            <button class="btn-icon btn-icon-sm variant-filled" on:click={addQuestion}><Fa icon={faPlus}/></button>
        </div>
        <div class="flex-grow overflow-y-auto" bind:this={scrollablePane}>
            <!-- <div class="h-full "> -->
                {#each theme.questions as question, i}
                <div class="my-2 mx-2">
                    <div class="input-group input-group-divider grid-cols-[4.5rem_1fr]">
                        <button 
                            class="variant-filled-error row-span-2"
                            style="justify-content: center;"
                            on:click={() => deleteQuestion(i)}
                            tabindex="-1">
                            <Fa icon={faTrash}/>
                        </button>
                        <input type="text" class="font-bold" bind:value={question.statement} placeholder="Question">
                        <input type="text" class="" bind:value={question.answer} placeholder="Réponse">
                    </div>
                </div>
                {/each}
            <!-- </div> -->
        </div>
        <div class="text-right">
            <button class="btn variant-filled-tertiary" on:click={saveTheme} disabled={saving}>Sauvegarder</button>
        </div>
    </div>
    
</div>

<style>
    label {
        display: inline;
    }
</style>