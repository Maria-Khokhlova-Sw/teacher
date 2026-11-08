'use client'
import styles from './account.module.scss'
import StatCard from '@/ui/StatCard/StatCard'
import Tag from '@/ui/Tag/Tag'
import {useAuth} from "@/context/AuthContext";
import { useRouter } from 'next/navigation'
import {useEffect, useState} from 'react'
import {api} from "@/api/api";

type StudentStats = {
    averageScore: number | null;
    testsCount: number;
    questionsCount: number;
    correctCount: number;
};

type Attempt = {
    id: number;
    testId: number;
    title: string;
    scorePercent: number;
    correctCount: number;
    totalCount: number;
    createdAt: string;
};

type AttemptsResponse = {
    stats: StudentStats;
    attempts: Attempt[];
};

export default function AccountPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    const [data, setData] = useState<AttemptsResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && user === null) {
            router.replace('/login');
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (loading || user === null) return;
        api.get<AttemptsResponse>(`/attempts`)
            .then(setData)
            .catch(() => setError('Не удалось загрузить данные ученика'));
    }, [loading, user]);

    if (loading || user === null) return null

    if (error) return <div>{error}</div>;
    if (!data) return <div>Загрузка...</div>;

    const { stats, attempts } = data;

    return (
        <div className={styles.wrapper}>
            <div>
                <h1 className={styles.title}>Привет, {user.name}</h1>
                <p className={styles.subtitle}>Твой прогресс по подготовке.</p>
            </div>

            <div className={styles.stats}>
                <StatCard
                    label="Средний балл"
                    value={stats.averageScore !== null ? `${stats.averageScore}%` : '—'}
                    description="За последние 10 тестов"
                />
                <StatCard
                    label="Тестов пройдено"
                    value={String(stats.testsCount)}
                    description="С начала подготовки"
                />
                <StatCard
                    label="Вопросов решено"
                    value={String(stats.questionsCount)}
                    description={`Правильно — ${stats.correctCount}`}
                />
            </div>

            <div>
                <h2 className={styles.sectionTitle}>Последние результаты</h2>
                <div className={styles.table}>
                    <div className={styles.tableHeader}>
                        <span>Тема</span>
                        <span>Результат</span>
                        <span>Дата</span>
                        <span></span>
                    </div>
                    {attempts.length === 0 && (
                        <div className={styles.tableRow}>
                            <span>Пока нет результатов — пройдите первый тест!</span>
                        </div>
                    )}
                    {attempts.map((attempt) => (
                        <div key={attempt.id} className={styles.tableRow}>
                            <span>{attempt.title}</span>
                            <Tag
                                text={`${attempt.scorePercent}%`}
                                variant={attempt.scorePercent >= 70 ? 'light-blue' : 'blue'}
                            />
                            <span className={styles.date}>
                                {new Date(attempt.createdAt).toLocaleDateString('ru-RU')}
                            </span>
                            <span className={styles.link}>Смотреть →</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
