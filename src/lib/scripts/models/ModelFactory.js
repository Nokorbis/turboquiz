export function newTimedQuestion() {
    return {
        statement: '',
        answer: '',
        points_value: 1
    };
}

export function newTimedTheme() {
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