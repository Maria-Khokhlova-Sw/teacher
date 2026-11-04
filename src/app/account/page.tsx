'use client'
import styles from './account.module.scss'
import StatCard from '@/ui/StatCard/StatCard'
import Tag from '@/ui/Tag/Tag'
import {useAuth} from "@/context/AuthContext";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const stats = [
    { label: 'Средний балл', value: '78%', description: 'За последние 10 тестов' },
    { label: 'Тестов пройдено', value: '24', description: 'С начала подготовки' },
    { label: 'Вопросов решено', value: '312', description: 'Правильно — 249' },
]

const recentResults = [
    { id: 1, topic: 'Орфография', score: 86, date: 'Вчера' },
    { id: 2, topic: 'Пунктуация', score: 54, date: '3 дня назад' },
    { id: 3, topic: 'Морфология', score: 91, date: 'Неделю назад' },
    { id: 4, topic: 'Синтаксис', score: 67, date: '2 недели назад' },
]

export default function AccountPage() {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && user === null) {
            router.replace('/login')
        }
    }, [loading, user, router])

    if (loading || user === null) return null

    return (
        <div className={styles.wrapper}>
            <div>
                <h1 className={styles.title}>Привет, {user.name}</h1>
                <p className={styles.subtitle}>Твой прогресс по подготовке.</p>
            </div>

            <div className={styles.stats}>
                {stats.map((stat) => (
                    <StatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        description={stat.description}
                    />
                ))}
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
                    {recentResults.map((result) => (
                        <div key={result.id} className={styles.tableRow}>
                            <span>{result.topic}</span>
                            <Tag
                                text={`${result.score}%`}
                                variant={result.score >= 70 ? 'light-blue' : 'blue'}
                            />
                            <span className={styles.date}>{result.date}</span>
                            <span className={styles.link}>Смотреть →</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
