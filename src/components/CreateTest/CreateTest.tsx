'use client'
import styles from './CreateTest.module.scss'
import Input from "@/ui/Input/Input";
import Button from "@/ui/Button/Button";
import {useState} from "react";
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import {api} from "@/api/api";
import Select from "@/ui/Select/Select";

type QuestionType = 'single' | 'multiple' | 'text' | 'letter_click'

type OptionDraft = {
    text: string
    isCorrect: boolean
}

type QuestionDraft = {
    id: string
    type: QuestionType
    topic: string
    text: string
    options: OptionDraft[]
    correctValue: string
    word: string
    correctPosition: number | null
}

const QUESTION_TYPES = [
    { value: 'single', label: 'Один правильный ответ' },
    { value: 'multiple', label: 'Несколько правильных' },
    { value: 'text', label: 'Текстовый ответ' },
    { value: 'letter_click', label: 'Кликни на гласную' },
]

const VOWELS = 'аеёиоуыэюя'

const emptyQuestion = (type: QuestionType = 'single'): QuestionDraft => ({
    id: crypto.randomUUID(),
    type,
    topic: '',
    text: '',
    options: type === 'single' || type === 'multiple'
        ? [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
        : [],
    correctValue: '',
    word: '',
    correctPosition: null,
})

export default function CreateTest() {
    const [title, setTitle] = useState('')
    const [timeMinutes, setTimeMinutes] = useState('30')
    const [classStudents, setClassStudents] = useState('9')
    const [questions, setQuestions] = useState<QuestionDraft[]>([emptyQuestion()])
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const {user, token} = useAuth()
    const router = useRouter()

    if (!user) return null
    if (user.role !== 'teacher') {
        router.push('/')
        return null
    }


    function updateQuestion(id: string, patch: Partial<QuestionDraft>) {
        setQuestions(prev => prev.map(q => q.id === id ? {...q, ...patch} : q))
    }

    function changeType(id: string, type: QuestionType) {
        setQuestions(prev => prev.map(q => {
            if (q.id !== id) return q
            return {
                ...emptyQuestion(type),
                id: q.id,
                topic: q.topic,
                text: q.text,
            }
        }))
    }

    function addOption(qId: string) {
        setQuestions(prev => prev.map(q => {
            if (q.id !== qId) return q
            return {...q, options: [...q.options, {text: '', isCorrect: false}]}
        }))
    }

    function updateOption(qId: string, index: number, patch: Partial<OptionDraft>) {
        setQuestions(prev => prev.map(q => {
            if (q.id !== qId) return q
            const options = q.options.map((opt, i) => i === index ? {...opt, ...patch} : opt)
            if (q.type === 'single' && patch.isCorrect === true) {
                options.forEach((opt, i) => {
                    if (i !== index) opt.isCorrect = false
                })
            }
            return {...q, options}
        }))
    }

    function removeOption(qId: string, index: number) {
        setQuestions(prev => prev.map(q => {
            if (q.id !== qId) return q
            if (q.options.length <= 2) return q
            return {...q, options: q.options.filter((_, i) => i !== index)}
        }))
    }

    function addQuestion() {
        if (questions.length >= 50) return
        setQuestions(prev => [...prev, emptyQuestion()])
    }

    function removeQuestion(id: string) {
        if (questions.length <= 1) return
        setQuestions(prev => prev.filter(q => q.id !== id))
    }

    function validate(): string | null {
        if (!title.trim()) return 'Укажите название теста'
        const time = Number(timeMinutes)
        if (!time || time < 0.5 || time > 120) return 'Время должно быть от 0.5 до 120 минут'
        if (!classStudents.trim()) return 'Укажите класс'
        for (let i = 0; i < questions.length; i++) {
            const q = questions[i]
            const n = i + 1
            if (!q.topic.trim()) return `Вопрос ${n}: укажите тему`
            if (!q.text.trim()) return `Вопрос ${n}: укажите текст вопроса`

            if (q.type === 'single' || q.type === 'multiple') {
                if (q.options.length < 2) return `Вопрос ${n}: минимум 2 варианта`
                if (q.options.some(o => !o.text.trim())) return `Вопрос ${n}: заполните все варианты`
                const correctCount = q.options.filter(o => o.isCorrect).length
                if (q.type === 'single' && correctCount !== 1) return `Вопрос ${n}: выберите ровно 1 правильный ответ`
                if (q.type === 'multiple' && correctCount < 1) return `Вопрос ${n}: выберите хотя бы 1 правильный ответ`
            }

            if (q.type === 'text' && !q.correctValue.trim()) {
                return `Вопрос ${n}: укажите правильный ответ`
            }

            if (q.type === 'letter_click') {
                if (!q.word.trim()) return `Вопрос ${n}: укажите слово`
                if (q.correctPosition === null) return `Вопрос ${n}: выберите правильную гласную`
            }
        }
        return null
    }

    async function handleSubmit() {
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return
        }

        setSubmitting(true)
        setError(null)

        const payload = {
            title: title.trim(),
            time: Math.round(Number(timeMinutes) * 60),
            class: classStudents.trim(),
            questions: questions.map(q => {
                const base = {
                    type: q.type,
                    topic: q.topic.trim(),
                    text: q.text.trim(),
                }

                if (q.type === 'single' || q.type === 'multiple') {
                    return {
                        ...base,
                        options: q.options.map(o => ({
                            text: o.text.trim(),
                            isCorrect: o.isCorrect,
                        })),
                    }
                }

                if (q.type === 'text') {
                    return {
                        ...base,
                        correctValue: q.correctValue.trim(),
                    }
                }

                // letter_click
                return {
                    ...base,
                    word: q.word.trim(),
                    correctPosition: q.correctPosition!,
                }
            }),
        }

        console.log('PAYLOAD:', JSON.stringify(payload, null, 2))  // ← смотри в консоли

        try {
            await api.post('/tests', payload)
            setSuccess(true)
        } catch (err: any) {
            // если api пробрасывает response
            console.error('ERROR BODY:', err?.response?.data ?? err)
            setError('Не удалось создать тест. Попробуйте ещё раз.')
        } finally {
            setSubmitting(false)
        }
    }

    if (success) {
        return (
            <div className={styles.container}>
                <h1>Тест создан!</h1>
                <Button variant="primary" onClick={() => router.push('/')}>
                    На главную
                </Button>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1>Создание теста</h1>

            <div className={styles.meta}>
                <Input
                    variant={ 'blue'}
                    value={title}
                    label="Название*"
                    onChange={setTitle}
                    placeholder="Название теста"
                />
                <Input
                    variant={ 'blue'}
                    value={timeMinutes}
                    label="Продолжительность (минуты)*"
                    onChange={setTimeMinutes}
                    placeholder="30"
                />
                <Input
                    variant={ 'blue'}
                    value={classStudents}
                    label="Укажите класс"
                    onChange={setClassStudents}
                    placeholder="9"
                />
            </div>

            <h2>Вопросы ({questions.length}/50)</h2>

            {questions.map((q, index) => (
                <div key={q.id} className={styles.questionCard}>
                    <div className={styles.questionHeader}>
                        <span>Вопрос {index + 1}</span>
                        {questions.length > 1 && (
                            <button
                                type="button"
                                className={styles.removeBtn}
                                onClick={() => removeQuestion(q.id)}
                            >
                                Удалить
                            </button>
                        )}
                    </div>

                    <Select
                        label="Тип вопроса"
                        value={q.type}
                        options={QUESTION_TYPES}
                        onChange={(value) => changeType(q.id, value as QuestionType)}
                    />

                    <Input
                        variant={ 'blue'}
                        value={q.topic}
                        label="Тема*"
                        onChange={v => updateQuestion(q.id, {topic: v})}
                        placeholder="Например: Глаголы"
                    />
                    <Input
                        variant={ 'blue'}
                        value={q.text}
                        label="Текст вопроса*"
                        onChange={v => updateQuestion(q.id, {text: v})}
                        placeholder="Сам вопрос..."
                    />

                    {(q.type === 'single' || q.type === 'multiple') && (
                        <div className={styles.optionsBlock}>
                            <label>Варианты ответа</label>
                            {q.options.map((opt, i) => (
                                <div key={i} className={styles.optionRow}>
                                    <input
                                        type={q.type === 'single' ? 'radio' : 'checkbox'}
                                        checked={opt.isCorrect}
                                        onChange={e => updateOption(q.id, i, {isCorrect: e.target.checked})}
                                        name={`correct-${q.id}`}
                                    />
                                    <Input
                                        variant={ 'blue'}
                                        value={opt.text}
                                        onChange={v => updateOption(q.id, i, {text: v})}
                                        placeholder={`Вариант ${i + 1}`}
                                    />
                                    {q.options.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeOption(q.id, i)}
                                            className={styles.smallRemove}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                            <Button variant="secondary" onClick={() => addOption(q.id)}>
                                + Добавить вариант
                            </Button>
                        </div>
                    )}

                    {q.type === 'text' && (
                        <Input
                            variant={ 'blue'}
                            value={q.correctValue}
                            label="Правильный ответ*"
                            onChange={v => updateQuestion(q.id, {correctValue: v})}
                            placeholder="Точный правильный ответ"
                        />
                    )}

                    {q.type === 'letter_click' && (
                        <div className={styles.letterClickBlock}>
                            <Input
                                variant={ 'blue'}
                                value={q.word}
                                label="Слово*"
                                onChange={v => updateQuestion(q.id, {word: v, correctPosition: null})}
                                placeholder="например: замок"
                            />
                            {q.word && (
                                <div className={styles.letters}>
                                    <span>Выберите правильную гласную:</span>
                                    <div className={styles.letterButtons}>
                                        {q.word.split('').map((letter, i) => {
                                            const isVowel = VOWELS.includes(letter.toLowerCase())
                                            if (!isVowel) {
                                                return <span key={i} className={styles.letter}>{letter}</span>
                                            }
                                            return (
                                                <button
                                                    key={i}
                                                    type="button"
                                                    className={styles.letterBtn}
                                                    data-selected={q.correctPosition === i}
                                                    onClick={() => updateQuestion(q.id, {correctPosition: i})}
                                                >
                                                    {letter}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}

            <div className={styles.actions}>
                <Button
                    variant="secondary"
                    onClick={addQuestion}
                    disabled={questions.length >= 50}
                >
                    + Добавить вопрос
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Создание...' : 'Создать тест'}
                </Button>
            </div>

            {error && <div className={styles.error}>{error}</div>}
        </div>
    )
}