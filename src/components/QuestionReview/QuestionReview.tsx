import {Answer, Question} from "@/types/test";
import styles from "./QuestionReview.module.scss";
import Tag from "@/ui/Tag/Tag";

type QuestionReviewProps = {
    question: Question;
    correctAnswer: Answer;
    studentAnswer?: Answer;
}
type OptionState = 'correct-selected' | 'correct-missed' | 'wrong-selected' | 'neutral'

function getOptionVariant(state: OptionState) {
    switch (state) {
        case 'correct-selected':
            return 'light-blue' as const
        case 'wrong-selected':
            return 'red' as const
        case 'correct-missed':
            return 'blue' as const
        case 'neutral':
            return null
    }
}

function getOptionState(optionId: number, correct: Answer, studentAnswer: Answer | undefined) : OptionState {
    const isCorrect = correct.type === 'single'
        ? correct.optionId === optionId
        : correct.type === 'multiple'
            ? correct.optionIds.includes(optionId)
            : false;

    const isSelected = studentAnswer?.type === 'single'
        ? studentAnswer?.optionId === optionId
        :studentAnswer?.type === 'multiple'
            ? studentAnswer?.optionIds.includes(optionId)
            : false;

    if (isCorrect && isSelected) return 'correct-selected'
    if (isCorrect && !isSelected) return 'correct-missed'
    if (!isCorrect && isSelected) return 'wrong-selected'
    return 'neutral'
}

function getLetterState(position:number, correct: Answer, studentAnswer: Answer | undefined) :OptionState {
    const isCorrect = correct.type === 'letter_click'
        && correct.position === position;
    const isSelected = studentAnswer?.type === 'letter_click' && studentAnswer.position === position;

    if (isCorrect && isSelected) return 'correct-selected'
    if (isCorrect && !isSelected) return 'correct-missed'
    if (!isCorrect && isSelected) return 'wrong-selected'
    return 'neutral'
}

export default function QuestionReview({ question, correctAnswer, studentAnswer }: QuestionReviewProps) {
    switch (question.type) {
        case 'single':
        case 'multiple':
            return (
                <div className={styles.block}>
                    <div>{question.text}</div>
                    <div className={styles.answer}>
                        {question.options.map((option) => {
                            const state = getOptionState(option.id, correctAnswer, studentAnswer)
                            const variant = getOptionVariant(state)
                            return variant ? (
                                <Tag key={option.id} text={option.text} variant={variant} />
                            ) : (
                                <span key={option.id}>{option.text}</span>
                            )
                        })}
                    </div>
                </div>
            )
        case 'text': {
            const isRight = correctAnswer.type === 'text' && studentAnswer?.type === 'text'
                && studentAnswer.value.trim().toLowerCase() === correctAnswer.value.trim().toLowerCase()
            return (
                <div className={styles.block}>
                    <div>{question.text}</div>
                    <div className={styles.option}>
                        <span>Ответ ученика:</span>
                        <Tag
                            text={studentAnswer?.type === 'text' ? studentAnswer.value : '—'}
                            variant={isRight ? 'light-blue' : 'red'}
                        />
                    </div>
                    <div className={styles.option}>
                        <span>Правильный ответ:</span>
                        <Tag
                            text={correctAnswer.type === 'text' ? correctAnswer.value : ''}
                            variant={'blue'}
                        />
                    </div>
                </div>
            )
        }
        case 'letter_click':
            return (
                <div className={styles.block}>
                    <div>{question.text}</div>
                    <div>
                        {question.word.split('').map((letter, i) => (
                            <span key={i} className={styles[getLetterState(i, correctAnswer, studentAnswer)]}>
                        {letter}
                    </span>
                        ))}
                    </div>
                </div>
            )
    }
}