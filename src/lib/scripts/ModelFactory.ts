import type { GridQuestionU, GridThemeWithQuestionsU, TimedQuestion, TimedQuestionU, TimedThemeWithQuestions, TimedThemeWithQuestionsU } from "$lib/data/supabase/models";

export function newTimedQuestion(): TimedQuestionU {
    return {
        statement: '',
        answer: '',
        points_value: 1
    };
}

export function newTimedTheme(): TimedThemeWithQuestionsU {
    return {
        name: '',
        is_mystery: false,
        questions: [
            newTimedQuestion(),
            newTimedQuestion(),
            newTimedQuestion(),
            newTimedQuestion(),
            newTimedQuestion()
        ]
    };
}

export function newGridQuestion(): GridQuestionU {
    return {
        statement: '',
        answer: '',
        points_value: 5
    };
}

export function newGridTheme(): GridThemeWithQuestionsU {
    return {
        name: '',
        owner_id:  null,
        color: '#2d3142',
        questions: [
            newGridQuestion(),
            newGridQuestion(),
            newGridQuestion(),
            newGridQuestion(),
            newGridQuestion()
        ]
    };
}