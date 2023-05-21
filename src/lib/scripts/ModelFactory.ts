import type { TimedQuestion, TimedQuestionU, TimedThemeWithQuestions, TimedThemeWithQuestionsU } from "$lib/data/supabase/models";

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