import { insert } from "svelte/internal";

export async function upsertTimedTheme(supabase, game, theme) {
    let themeId = theme.id;
    let errored = false;
    if (themeId) {
        const {data: result, error} = await supabase.from('timed_theme')
            .update({name: theme.name, is_mystery: theme.is_mystery})
            .eq('id', themeId)
            .eq('game_id', game.id)
            .select().single();
        theme = result;
        errored = error;
    }
    else {
        const {data: result, error} = await supabase.from('timed_theme')
            .insert([{game_id: game.id, name: theme.name, is_mystery: theme.is_mystery}])
            .select().single();
        theme = result;
        errored = error;
    }

    return {theme, error: errored};
}

export async function upsertTimedQuestions(supabase, themeId, questions) {
    console.log('Upsert question')
    // Easy alternative : Delete all, insert all
    const toInsert = questions.filter(q => !q.id).map(q => {
        return {
            theme_id: themeId,
            statement: q.statement, answer: q.answer,
            points_value: q.points_value
        };
    });
    const toUpdate = questions.filter(q => q.id);

    const errors = []
    if (toInsert) {
        const {data, error} = await supabase.from('timed_question').insert(toInsert);
        if (error) {
            errors.push(error);
        }
    }
    if (toUpdate) {
        for (let i = 0; i < toUpdate.length; i++) {
            const question = toUpdate[i];
            const {data, error} = await supabase.from('timed_question')
                .update({
                    statement: question.statement, 
                    answer: question.answer,
                    points_value: question.points_value
                })
                .match({id: question.id, theme_id: themeId});
            
            if (error) {
                errors.push(error);
            }
        }
    }

    return errors;
}