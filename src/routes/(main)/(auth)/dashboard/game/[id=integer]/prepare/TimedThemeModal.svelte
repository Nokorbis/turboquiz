<script>
	import { tick } from "svelte";
    import { modalStore } from "@skeletonlabs/skeleton";
	import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa/src/fa.svelte";
	import { newTimedQuestion } from "$lib/scripts/models/ModelFactory";

    export let theme;
    let saving = false;
    let deletedQuestions = [];
    let scrollablePane;

    function saveTheme() {
        if ($modalStore[0]?.response) {
            saving = true;
            $modalStore[0].response({theme, deletedQuestions});
            saving = false;
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

    function deleteQuestion(index) {
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
                    oldQuestion
                ];
            }
            theme.questions = qs;
        }
        
    }
</script>

<div class="card bg-white p-4 h-[calc(100%-4rem)] w-[64rem]">
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