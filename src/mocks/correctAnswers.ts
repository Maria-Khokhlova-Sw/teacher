import type {Answer} from '@/types/test'

// testId -> questionId -> правильный ответ.
// Не импортируется компонентом Question — используется только при подсчёте результата,
// как если бы это была проверка на бэкенде.
export const correctAnswers: Record<number, Record<number, Answer>> = {
    1: {
        1: {type: 'single', questionId: 1, optionId: 3},
        2: {type: 'single', questionId: 2, optionId: 1},
        3: {type: 'single', questionId: 3, optionId: 4},
    },
    2: {
        1: {type: 'multiple', questionId: 1, optionIds: [1, 3]},
        2: {type: 'multiple', questionId: 2, optionIds: [1, 2]},
        3: {type: 'multiple', questionId: 3, optionIds: [1, 2, 3, 4]},
    },
    3: {
        1: {type: 'text', questionId: 1, value: 'д'},
        2: {type: 'text', questionId: 2, value: 'л'},
        3: {type: 'text', questionId: 3, value: 'з'},
    },
    4: {
        1: {type: 'text', questionId: 1, value: 'д'},
        2: {type: 'text', questionId: 2, value: 'л'},
        3: {type: 'text', questionId: 3, value: 'з'},
        4: {type: 'letter_click', questionId: 4, position: 3},
        5: {type: 'letter_click', questionId: 5, position: 3},
        6: {type: 'letter_click', questionId: 6, position: 0},
    },
}
