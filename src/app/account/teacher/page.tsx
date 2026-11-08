'use client'
import styles from './account-teacher.module.scss'
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import Input from "@/ui/Input/Input";
import { ReactComponent as Search } from '../../../assets/icons/search.svg'
import type {User, Test} from "@/types/test";
import {api} from "@/api/api";
import Link from "next/link";
import Button from "@/ui/Button/Button";
import Tag from "@/ui/Tag/Tag";

export default function AccountTeacherPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [name, setName] = useState('')
    const [test, setTest] = useState('')
    const [students, setStudents] = useState<User[]>([]);
    const [tests, setTests] = useState<Test[]>([]);
    const [classStudent, setClassStudent] = useState('');

    useEffect(() => {
        api.get<User[]>('/students')
            .then(setStudents)
            .catch(()=>console.error('Не удалось загрузить список учеников'))
        api.get<Test[]>('/tests')
            .then(setTests)
            .catch(()=>console.error('Не удалось загрузить тесты'))
    }, []);

    useEffect(() => {
        if (loading) return
        if (user === null) {
            router.replace('/login')
        } else if (user.role !== 'teacher') {
            router.replace('/')
        }
    }, [loading, user, router])

    const hasQuery = name.trim() !== '' || classStudent.trim() !== '';
    const hasTestQuery = test.trim() !== '';


    const filteredStudents = useMemo(() => {
        const query = name.trim().toLowerCase();
        const classQuery = classStudent.trim();
        return students.filter((student) => {
                const matchesName = !query || student.name.toLowerCase().includes(query);
                const matchesStudents = !classStudent || String(student.class ?? '').includes(classQuery);
                return matchesName && matchesStudents;
            }
        );
    }, [name, classStudent, students]);

    const filteredTests = useMemo(() => {
        const query = test.trim().toLowerCase();
        return tests.filter((t) => {
                const matchesTest = !query || t.title.toLowerCase().includes(query);
                const yourTest = t.userId === user?.id;
            return matchesTest && yourTest;
            }
        );
    }, [test, tests, user]);

    function createTest() {
        router.push('/test/create')
    }

    if (loading || user === null || user.role !== 'teacher') return null

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{user.name}</h1>
            <div className={styles.seach}>
                <Button variant={'primary'} onClick={createTest} >Создать тест</Button>
                <div className={styles.subtitle}>Поиск учеников</div>
                <div className={styles.block}>
                    <div className={styles.inputs}>
                        <div className={styles.input}>
                            <Input placeholder={'Начните вводить имя'} value={name} onChange={setName} />
                            <Search className={styles.icon}/>
                        </div>
                        <div className={styles.inputClass}>
                            <Input placeholder={'введите класс'} type={'number'} value={classStudent} onChange={setClassStudent}/>
                        </div>
                    </div>
                    {hasQuery && (
                        filteredStudents.length === 0 ?
                            <div>Никого не нашлось</div>
                            :(
                                <div className={styles.students}>
                                    {filteredStudents.map(student => (
                                        <Link href={`/account/${student.id}`} key={student.id} className={styles.student}>{student.name}</Link>
                                    ))}
                                </div>
                            )
                    )
                    }
                    <div className={styles.subtitle}>Мои тесты</div>
                    <div className={styles.inputs}>
                        <div className={styles.input}>
                            <Input placeholder={'Название теста'} value={test} onChange={setTest} />
                            <Search className={styles.icon}/>
                        </div>
                    </div>
                    {hasTestQuery && (
                        filteredTests.length === 0 ?
                            <div>Вы пока не создали тест с таким названием</div>
                            :(
                                <div className={styles.tests}>
                                    {filteredTests.map((t) => (
                                        <Link href={`/test/${t.id}`} key={t.id} className={styles.test}>
                                            <span>{t.title}</span>
                                            {
                                                t.isPublished ? <Tag variant={'light-blue'} text={'опубликован'}/> : <Tag variant={'red'} text={'не опубликован'}/>
                                            }
                                        </Link>
                                    ))}
                                </div>
                            )
                    )
                    }
                </div>
            </div>
        </div>
    )
}
