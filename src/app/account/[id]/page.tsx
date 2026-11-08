'use client'
import styles from './account.module.scss'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { api } from '@/api/api'
import { User } from '@/types/test'
import StatCard from '@/ui/StatCard/StatCard'
import Tag from '@/ui/Tag/Tag'

type StudentStats = {
    averageScore: number | null;
    testsCount: number;
    questionsCount: number;
    correctCount: number;
};

type Attempt = {
    id: number;
    topic: string;
    score: number;
    date: string;
};

type StudentProfile = {
    student: User;
    stats: StudentStats;
    attempts: Attempt[];
};

export default function StudentAccountPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const params = useParams<{ id: string }>();
    const id = params.id;

    const [profile, setProfile] = useState<StudentProfile | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!loading && user === null) {
            router.replace('/login');
        }
    }, [loading, user, router]);

    useEffect(() => {
        if (loading || user === null) return;
        if (user.role === 'student' && String(user.id) !== id) {
            router.replace('/account');
            return;
        }

        api.get<StudentProfile>(`/students/${id}`)
            .then(setProfile)
            .catch(() => setError('Не удалось загрузить данные ученика'));
    }, [id, loading, user, router]);

    if (loading || user === null) return null;
    if (error) return <div>{error}</div>;
    if (!profile) return <div>Загрузка...</div>;

    const { student, stats, attempts } = profile;

    return (
        <div className={styles.wrapper}>
            <div>
                <h1 className={styles.title}>{student.name}</h1>
                {student.class !== null && (
                    <p className={styles.subtitle}>{student.class} класс</p>
                )}
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
                {attempts.length === 0 ? (
                    <p>Пока нет пройденных тестов</p>
                ) : (
                    <div className={styles.table}>
                        <div className={styles.tableHeader}>
                            <span>Тема</span>
                            <span>Результат</span>
                            <span>Дата</span>
                            <span></span>
                        </div>
                        {attempts.map((attempt) => (
                            <div key={attempt.id} className={styles.tableRow}>
                                <span>{attempt.topic}</span>
                                <Tag
                                    text={`${attempt.score}%`}
                                    variant={attempt.score >= 70 ? 'light-blue' : 'blue'}
                                />
                                <span className={styles.date}>{attempt.date}</span>
                                <span className={styles.link}>Смотреть →</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
