import styles from "./Result.module.scss";
import Tag from "@/ui/Tag/Tag";
import {Answer, QuestionResult, Test} from "@/types/test";
import {correctAnswers} from "@/mocks/correctAnswers";
import {useState} from "react";
import QuestionReview from "@/components/QuestionReview/QuestionReview";
import Button from "@/ui/Button/Button";


type ResultProps ={
    test: Test;
    results: QuestionResult[];
    answers: Answer[];
    isTeacher?: boolean;
    onRetry?: () => void;
}

export default function Result({test, results, answers, isTeacher = false, onRetry}: ResultProps ){
    const [openId, setOpenId] = useState<number | null>(null);

    function toggle(questionId: number){
        setOpenId((prev) => prev === questionId ? null : questionId);
    }

    return (
        <div className={styles.results}>
            {onRetry && (
                <div className={styles.retry}>
                    <Button variant={'primary'} onClick={onRetry}>Пройти ещё раз</Button>
                </div>
            )}
            {test.questions.map((question, i) => {
                    const result = results.find((r) => r.questionId === question.id)
                    const correct = correctAnswers[test.id]?.[question.id]
                    const studentAnswer = answers.find((a) => a.questionId === question.id)
                    return (
                        <div key={question.id} className={styles.result}>
                            <div
                                className={styles.header}
                                onClick={() => isTeacher && toggle(question.id)}
                            >
                                <span className={styles.text}>Вопрос {i + 1}</span>
                                <div className={styles.block}>
                                    <Tag
                                        text={result?.isCorrect ? 'Верно' : 'Неверно'}
                                        variant={result?.isCorrect ? 'light-blue' : 'blue'}
                                    />
                                    {isTeacher && correct && (
                                        <span className={openId === question.id ? styles.arrowOpen : styles.arrow}>›</span>
                                    )}
                                </div>
                            </div>
                            {isTeacher && openId === question.id && correct && (
                                <QuestionReview
                                    question={question}
                                    correctAnswer={correct}
                                    studentAnswer={studentAnswer}
                                />
                            )}
                        </div>
                    )
                }
            )
            }

        </div>
    )
}