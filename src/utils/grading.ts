import {Answer, QuestionResult} from "@/types/test";
import {correctAnswers} from "@/mocks/correctAnswers";

function isAnswerCorrect(userAnswer: Answer, correct: Answer): boolean {
    switch (userAnswer.type) {
        case 'single':
            return correct.type === 'single' && userAnswer.optionId === correct.optionId
        case 'multiple': {
            if (correct.type !== 'multiple') return false;
            const a = [...userAnswer.optionIds].sort()
            const b = [...correct.optionIds].sort()
            return a.length === b.length && a.every((id, i) => id === b[i])
        }
        case 'text':
            return correct.type === 'text'
                && userAnswer.value.trim().toLowerCase() === correct.value.trim().toLowerCase()
        case 'letter_click':
            return correct.type === 'letter_click' && userAnswer.position === correct.position
    }
}

export function gradeTest(testId: number, userAnswer: Answer[]):QuestionResult[] {
    return userAnswer.map((answer) =>{
        const correct = correctAnswers[testId]?.[answer.questionId]
        return{
            questionId: answer.questionId,
            isCorrect: correct ? isAnswerCorrect(answer, correct) : false,
        }
    })
}