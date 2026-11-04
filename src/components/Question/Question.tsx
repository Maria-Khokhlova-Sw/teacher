import styles from './Question.module.scss';
import Checkbox from "@/ui/Checkbox/Checkbox";
import Input from "@/ui/Input/Input";
import Tag from "@/ui/Tag/Tag";
import ProgressBar from "@/ui/ProgressBar/ProgressBar";
import Button from "@/ui/Button/Button";
import {useState} from "react";
import type {Answer, Question} from "@/types/test";

const VOWELS = 'аеёиоуыэюя'

type QuestionProps = {
    question: Question;
    index: number;
    total: number;
    timeLeft: string;
    onAnswer: (answer: Answer) => void;
}

export default function Question({question, index, total, timeLeft, onAnswer}: QuestionProps) {
    const [answer, setAnswer] = useState<Answer | null>(null)

    const percent = Math.round(((index - 1) / total) * 100)
    const hasAnswer = answer !== null && !(answer.type === 'text' && answer.value.trim() === '')

    function renderAnswer() {
        switch (question.type) {
            case 'single':
                return (
                    <div className={styles.answers}>
                        {question.options.map((option) => (
                            <Checkbox
                                key={option.id}
                                label={option.text}
                                type={'radio'}
                                checked={answer?.type === 'single' && answer.optionId === option.id}
                                onChange={() => setAnswer({
                                    type: 'single',
                                    questionId: question.id,
                                    optionId: option.id
                                })}
                                name={`question-${question.id}`}
                            />
                        ))}
                    </div>
                )
            case 'multiple':
                return (
                    <div className={styles.answers}>
                        {question.options.map((option) => {
                            const selectedIds = answer?.type === 'multiple' ? answer.optionIds : []
                            const checked = selectedIds.includes(option.id)
                            return (
                                <Checkbox
                                    key={option.id}
                                    label={option.text}
                                    type={'checkbox'}
                                    checked={checked}
                                    onChange={() => {
                                        const nextIds = checked
                                            ? selectedIds.filter((id) => id !== option.id)
                                            : [...selectedIds, option.id]
                                        setAnswer({
                                            type: 'multiple',
                                            questionId: question.id,
                                            optionIds: nextIds
                                        })
                                    }}
                                />
                            )
                        })}
                    </div>
                )
            case 'text':
                return (
                    <Input
                        value={answer?.type === 'text' ? answer.value : ''}
                        onChange={(value) => setAnswer({
                            type: 'text',
                            questionId: question.id,
                            value
                        })}
                    />
                )
            case 'letter_click':
                return (
                    <div className={styles.letters}>
                        {question.word.split('').map((letter, letterIndex) => {
                            const isVowel = VOWELS.includes(letter.toLowerCase())
                            if (!isVowel) {
                                return <span key={letterIndex}>{letter}</span>
                            }
                            const selected = answer?.type === 'letter_click' && answer.position === letterIndex
                            return (
                                <button
                                    key={letterIndex}
                                    type={'button'}
                                    data-selected={selected}
                                    onClick={() => setAnswer({
                                        type: 'letter_click',
                                        questionId: question.id,
                                        position: letterIndex
                                    })}
                                    className={styles.btn}
                                >
                                    {letter}
                                </button>
                            )
                        })}
                    </div>
                )
        }
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.meta}>
                <Tag text={question.topic} variant={'red'} />
                <Tag text={timeLeft} variant={'blue'} />
            </div>
            <div className={styles.progressInfo}>
                <span>Вопрос {index} из {total}</span>
                <span>{percent}%</span>
            </div>
            <ProgressBar percent={percent} />
            <div className={styles.blockBtn}>
                <div className={styles.block}>
                    <div className={styles.title}>{question.text}</div>
                    {renderAnswer()}
                </div>
                <Button
                    variant={'primary'}
                    disabled={!hasAnswer}
                    onClick={() => answer && onAnswer(answer)}
                >
                    {index === total ? 'Завершить тест' : 'Далее'}
                </Button>
            </div>
        </div>
    )
}
