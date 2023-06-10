<script lang="ts">
	import { tick } from "svelte";
    import { modalStore, toastStore } from "@skeletonlabs/skeleton";
	import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa/src/fa.svelte";
	import { newTimedQuestion } from "$lib/scripts/ModelFactory";
	import type { Database } from "$lib/data/supabase/types";
	import type { TimedQuestion, TimedQuestionU, TimedThemeWithQuestionsU } from "$lib/data/supabase/models";

    export let theme: TimedThemeWithQuestionsU;
    let saving = false;
    let deletedQuestions: TimedQuestion[] = [];
    let scrollablePane: HTMLDivElement;

    function saveTheme() {
        if ($modalStore[0]?.response) {
            try {
                validate();
                saving = true;
                cleanTheme();
                $modalStore[0].response({theme, deletedQuestions, processEnd: () => saving = false});
            } 
            catch (e: any) {
                console.error(e);
                toastStore.trigger({
                    message: e.message,
                    background: 'variant-filled-error'
                });
            }
            
        }
    }

    function addQuestion() {
        theme.questions = [...theme.questions, 
            newTimedQuestion()
        ];
        tick().then(() => {
            scrollablePane.scrollTop = scrollablePane.scrollTopMax || scrollablePane.scrollHeight;
        });   
    }

    function validate() {
        theme.name = theme.name?.trim();
        if (!theme.name) {
            throw new Error("Le nom du thème est obligatoire");
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
            if (!q.statement && !q.answer) {
                toDelete.push(i);
            }
        });
        toDelete.sort((a, b) => {
            return b - a;
        });
        toDelete.forEach(deleteQuestion);
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
                    oldQuestion as TimedQuestion
                ];
            }
            theme.questions = qs;
        }
        
    }
</script>

<div class="card bg-white p-4 h-[calc(100%-2rem)] sm:h-[calc(100%-4rem)] w-[64rem]">
    <div class="flex flex-col h-full gap-2">
        <div class="grid grid-cols-[max-content_3fr_max-content_max-content] gap-2 items-center">
            <label class="label" for="theme-name">Nom : </label>
            <input id="theme-name" type="text" class="input" bind:value={theme.name}>
            <label for="mystery-theme">Mystère : </label>
            <input class="checkbox" type="checkbox" bind:checked={theme.is_mystery}>
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
                            class="variant-filled-error"
                            style="justify-content: center;"
                            on:click={() => deleteQuestion(i)}
                            tabindex="-1">
                            <Fa icon={faTrash}/>
                        </button>
                        <input type="text" class="font-bold" bind:value={question.statement} placeholder="Question">
                        <input type="number" 
                            style="min-width: 4rem !important; width: 4.5rem; padding-inline-start: 1.25rem"
                            min=0 max=100 step=1
                            bind:value={question.points_value}
                            title="Points par bonne réponse"
                            tabindex="-1">
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