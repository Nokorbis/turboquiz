<script lang="ts">
	import { faCircleQuestion, faPlus } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa/src/fa.svelte";
	import ModalThemeTimed from "./ModalThemeTimed.svelte";
	import { modalStore, toastStore } from "@skeletonlabs/skeleton";
	import { newTimedTheme } from "$lib/scripts/ModelFactory";
	import { upsertTimedQuestions, upsertTimedTheme } from "$lib/scripts/SupabaseHelper";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "$lib/data/supabase/types";
	import type { Game, TimedQuestion, TimedThemeWithQuestions, TimedThemeWithQuestionsU } from "$lib/data/supabase/models";

    export let supabase: SupabaseClient<Database>;
    export let game: Game;

    let gameThemes$ = loadThemes();

    function loadThemes() {
        return supabase.from('timed_theme')
            .select('id, name, is_mystery, questions:timed_question(*)')
            .eq('game_id', game.id)
            .order('name', {ascending: true})
            .order('points_value', {foreignTable: 'timed_question'})
            .order('id', {foreignTable: 'timed_question'});
    }

    type ModalResult = {theme: TimedThemeWithQuestions, deletedQuestions: TimedQuestion[], processEnd: Function}
    async function saveTheme(response: ModalResult) {
        if (response) {
            console.log({response})
            let {theme, deletedQuestions, processEnd} = response;
            let {theme: dbTheme, error} = await upsertTimedTheme(supabase, game, theme);
            if (error) {
                console.error(error);
                toastStore.trigger({
                    message: error.message,
                    background: 'variant-filled-error'
                });
                processEnd();
            }
            else {
                if (deletedQuestions) {
                    supabase.from('timed_question').delete()
                        .eq('theme_id', dbTheme!.id)
                        .in('id', deletedQuestions.map(q => q.id))
                        .then(({data: _, error}) => {
                            if (error) {
                                console.error(error);
                                toastStore.trigger({
                                    message: error.message,
                                    background: 'variant-filled-error'
                                });
                            }
                            else {
                                console.log('Questions were deleted');
                            }
                        })
                }
                if (theme.questions) {
                    const errors = await upsertTimedQuestions(supabase, dbTheme!.id, theme.questions);
                    if (errors.length > 0) {
                        console.error({errors});
                        toastStore.trigger({
                            message: errors.map(e => e.message).join('<br>'),
                            background: 'variant-filled-error'
                        });
                    }
                    else {
                        toastStore.trigger({
                            message: 'Le thème a été enregistré',
                            background: 'variant-filled-success',
                            timeout: 2500
                        });
                    }
                }
                processEnd();
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

    function createNewThemeModal() {
        openThemeEditorModal(newTimedTheme());
    }

    function openThemeEditorModal(theme: TimedThemeWithQuestionsU) {
        const modalComponent = {
            ref: ModalThemeTimed,
            props: {
                supabase,
                theme: structuredClone(theme)
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
        <p class="font-bold">Thèmes : <button class="btn-icon btn-icon-sm variant-filled" on:click={createNewThemeModal}><Fa icon={faPlus}/></button></p>
        {#await gameThemes$}
            Chargement des thèmes
        {:then {data: gameThemes, error}} 
            {#if error}
                {error.message}
            {:else}
            <ul class="grid grid-cols-[max-content_max-content_1fr] gap-2 items-center text-lg mt-2">
                {#each gameThemes as theme}
                    <li class="contents cursor-pointer card" on:click={() => openThemeEditorModal(theme)}>
                        <div class="justify-self-end">
                            <span class="badge variant-filled-surface text-base">{theme.questions.length}</span>
                        </div>
                        <div>
                            {#if theme.is_mystery}
                            <span class="badge-icon" title="Thème mystère">
                                <Fa icon={faCircleQuestion} color="#f2cb00" size="2x"/>
                            </span>
                            {/if}
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