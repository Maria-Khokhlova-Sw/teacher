'use client'
import styles from "@/app/page.module.css";
import Question from "@/components/Question/Question";
import {useEffect, useState} from "react";
import {Answer, QuestionResult, Test} from "@/types/test";
import Modal from "@/ui/Modal/Modal";
import Result from "@/components/Result/Result";
import {useAuth} from "@/context/AuthContext";
import {api} from "@/api/api";

const TEST_ID = 4;

function TestRunner({ test }: { test: Test }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [secondsLeft, setSecondsLeft] = useState(test.time)
    const [pendingAnswers, setPendingAnswers] = useState<Answer | null>(null)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [results, setResults] = useState<QuestionResult[]>([]);
    const currentQuestion = test.questions[currentIndex];
    const [submitError, setSubmitError] = useState<string | null>(null)
    const { user, token} = useAuth()

    const isLast = currentIndex === test.questions.length - 1

    function handleAnswer(answer: Answer) {
        if(isLast){
            setPendingAnswers(answer)
            setConfirmOpen(true)
            return
        }
        setAnswers((prev) => [...prev, answer]);
        setCurrentIndex((prev) => prev + 1);
    }

    async function submitAttempt(finalAnswers: Answer[]) {
        setSubmitError(null);
        try {
            const data = await api.post<{ results: QuestionResult[] }>(
                `/tests/${test.id}/attempts`,
                { answers: finalAnswers },
            );
            setResults(data.results);
            setAnswers(finalAnswers);
            setCurrentIndex(test.questions.length);
            setConfirmOpen(false);
        } catch {
            setSubmitError('Не удалось отправить результат, попробуйте ещё раз');
        }
    }

    async function confirmFinish(){
        if(!pendingAnswers) return
        await submitAttempt([...answers, pendingAnswers]);
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsLeft((prev) => {
                if(prev <= 1) {
                    clearInterval(interval)
                    return 0;
                }
                return prev - 1;
            })
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (secondsLeft <= 0) {
            setConfirmOpen(false)
        }
    }, [secondsLeft])

    if (currentIndex >= test.questions.length) {
        return <Result test={test} results={results} answers={answers} isTeacher={user?.role === 'teacher'} onRetry={restart} />
    }

    function restart() {
        setAnswers([]);
        setResults([]);
        setSecondsLeft(test.time);
        setCurrentIndex(0);
        setPendingAnswers(null);
        setConfirmOpen(false);
        setSubmitError(null);
    }

    function handleTimeUp(){
        submitAttempt(answers)
    }

    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    const timeLeft = `${minutes}:${String(seconds).padStart(2, '0')}`

    return (
        <div className={styles.container}>
            <Modal
                open={confirmOpen}
                title={submitError ?? 'Вы точно хотите завершить тест?'}
                onConfirm={confirmFinish}
                onCancel={() => setConfirmOpen(false)}
            />
            <Question
                key = {currentQuestion.id}
                question={currentQuestion}
                index={currentIndex + 1}
                total={test.questions.length}
                timeLeft={timeLeft}
                onAnswer={handleAnswer}
            />
            <Modal
                open={secondsLeft <= 0}
                title={submitError ?? 'Время вышло'}
                confirmText={'Посмотреть результаты'}
                onConfirm={handleTimeUp}
            />
        </div>
    );
}

export default function TestPage(){
    const {token, loading} = useAuth()
    const [test, setTest] = useState<Test | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!token) return
        api.get<Test>(`/tests/${TEST_ID}`)
            .then(setTest)
            .catch(() => setError('Не удалось загрузить тест'))
    }, [token])

    if (error) return <div>{error}</div>
    if (loading || !test) return <div>Загрузка...</div>

    return <TestRunner key={test.id} test={test} />
}