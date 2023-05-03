<script>
	import { faCircleQuestion, faPlus } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa/src/fa.svelte";
	import TimedThemeModal from "./TimedThemeModal.svelte";
	import { modalStore, toastStore } from "@skeletonlabs/skeleton";

    export let supabase;
    export let game;

    let gameThemes$ = loadThemes();

    function loadThemes() {
        return supabase.from('timed_theme')
            .select('id, name, is_mystery, questions:timed_question(*)')
            .eq('game_id', game.id);
    }

    async function saveTheme(response) {
        if (response) {
            console.log({response})
            const {data: result, error} = await supabase.from('timed_theme')
                .insert([{user_id: response.user_id, game_key: game.access_key}]);

            if (error) {
                toastStore.trigger({
                    message: error.message,
                    background: 'variant-filled-error'
                });
            }
            else {
                modalStore.close();
                gameThemes$ = loadThemes();
            }
        }
        else {
            toastStore.trigger({
                message: 'Le thème n\'a pas été sauvegardé',
                timeout: 2000
            });
        }
    }

    function openThemeEditorModal(theme) {
        const modalComponent = {
            ref: TimedThemeModal,
            props: {
                supabase,
                theme
            }
        };
        modalStore.trigger( {
             type: 'component',
             component: modalComponent,
             response: saveTheme
        });
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
            <ul class="grid grid-cols-[max-content_max-content_1fr] gap-2 items-center text-lg mt-2">
                {#each gameThemes as theme}
                    <li class="contents cursor-pointer" on:click={() => openThemeEditorModal(theme)}>
                        <div class="justify-self-end">
                            <span class="badge variant-filled-surface text-base">{theme.questions.length}</span>
                        </div>
                        <div>
                            <span class="badge-icon" title="Thème mystère">
                                <Fa icon={faCircleQuestion} color="#f2cb00" scale="2x"/>
                            </span>
                        </div>
                        <div>
                            <span class="grow">{theme.name}</span>
                        </div>
                    </li>                    
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

    li.contents:hover>div {
        background: #f7f7f7;
    }
</style>