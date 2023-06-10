<script lang="ts">
	import { modalStore, toastStore } from "@skeletonlabs/skeleton";
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "$lib/data/supabase/types";
    import Fa from "svelte-fa/src/fa.svelte";
	import { faPlus, faTrash, faUser } from "@fortawesome/free-solid-svg-icons";
    import type { Game, GamePlayerWithProfile, GridQuestion, GridThemeWithQuestions, GridThemeWithQuestionsU } from "$lib/data/supabase/models";
	import { newGridTheme } from "$lib/scripts/ModelFactory";
	import ModalThemeGrid from "./ModalThemeGrid.svelte";
    import {upsertGridTheme, upsertGridQuestions} from "$lib/scripts/SupabaseHelper";

    export let supabase: SupabaseClient<Database>;
    export let game: Game;
    export let players: GamePlayerWithProfile[];

    let themes$ = loadThemes();

    function loadThemes() {
        return supabase.from('grid_theme')
            .select('*, questions:grid_question(*)')
            .eq('game_id', game.id)
            .order('name', {ascending: true})
            .order('points_value', {foreignTable: 'grid_question'})
            .order('id', {foreignTable: 'grid_question'});
    }

    function createNewThemeModal() {
        openThemeEditorModal(newGridTheme());
    }

    function openThemeEditorModal(theme: GridThemeWithQuestionsU) {
        const modalComponent = {
            ref: ModalThemeGrid,
            props: {
                supabase,
                theme: structuredClone(theme),
                players
            }
        };
        modalStore.trigger( {
             type: 'component',
             component: modalComponent,
             response: saveTheme
        });
    }

    type ModalResult = {theme: GridThemeWithQuestionsU, deletedQuestions: GridQuestion[], processEnd: Function}
    async function saveTheme(response: ModalResult) {
        if (response) {
            console.log({response})
            let {theme, deletedQuestions, processEnd} = response;
            let {theme: dbTheme, error} = await upsertGridTheme(supabase, game, theme);
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
                    supabase.from('grid_question').delete()
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
                    const errors = await upsertGridQuestions(supabase, dbTheme!.id, theme.questions);
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
                themes$ = loadThemes();
            }
        }
        else {
            toastStore.trigger({
                message: 'Le thème n\'a pas été sauvegardé',
                timeout: 2000
            });
        }
    }

    function deleteTheme(theme: GridThemeWithQuestions) {
        if (confirm(`Voulez-vous supprimer le thème "${theme.name}" ?`)) {
            supabase.from('grid_theme').delete().eq('id', theme.id)
                .then(({data: _, error}) => {
                    if (error) {
                        console.error(error);
                        toastStore.trigger({
                            message: error.message,
                            background: 'variant-filled-error'
                        });
                    }
                    else {
                        toastStore.trigger({
                            message: 'Le thème a été supprimé',
                            background: 'variant-filled-success',
                            timeout: 2500
                        });
                    }
                    themes$ = loadThemes();
                })
        }
    }
</script>

<div class="card bg-white p-4">
{#await themes$}
    <div class="grid gap-1 grid-cols-[1fr_1fr]">
        {#each Array(10) as _}
            <div class="placeholder animate-pulse"></div>
            <div class="placeholder animate-pulse"></div>
        {/each}
    </div>
{:then {data: themes, error}} 
    {#if error || !themes}
        Une erreur est survenue lors des thèmes
    {:else}
        <p class="font-bold">Thèmes : <button class="btn-icon btn-icon-sm variant-filled" on:click={createNewThemeModal}><Fa icon={faPlus}/></button></p>
        <div class="mt-2 grid gap-1 grid-cols-[1fr] sm:grid-cols-[1fr_1fr]">
            {#each themes as theme}
            {@const questionsCount = theme.questions?.length ?? 0}
                <div class="card p-4 cursor-pointer" on:click={() => openThemeEditorModal(theme)}>
                    <p class="font-bold grid items-center
                    grid-cols-[max-content_max-content_max-content_1fr]
                    sm:grid-cols-[max-content_max-content_max-content_max-content_1fr] 
                    gap-1 sm:gap-2">
                        <span class="badge-icon inline-flex variant-filled-error p-3" on:click|stopPropagation={() => deleteTheme(theme)}><Fa icon={faTrash}/></span>
                        <span class="hidden sm:block theme-color w-[24px] h-[24px] rounded-full" title="Couleur du thème" style="--theme-color:{theme.color}"></span>
                        {#if theme.owner_id}
                            <span class="badge-icon variant-filled p-3" title="Thème joueur"><Fa icon={faUser}/></span>
                        {:else}
                            {@const questionsPoints = questionsCount > 0 ? theme.questions[0].points_value : '?' }
                            <span class="badge variant-filled" title="{questionsPoints} points">{ questionsPoints }</span>
                        {/if}
                        <span title="{questionsCount} questions" class="badge variant-ghost-tertiary">{questionsCount}</span>
                        <span class="text-lg truncate text-ellipsis">{theme.name}</span>
                    </p>
                </div>
            {/each}
        </div>
    {/if}

{/await}
</div>

<style>
    .theme-color {
        background-color: var(--theme-color,  var(--turbo-darkgray));
    }
</style>