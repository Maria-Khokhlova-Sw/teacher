'use client'
import styles from './account-teacher.module.scss'
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";
import {useEffect, useMemo, useState} from "react";
import Input from "@/ui/Input/Input";
import { ReactComponent as Search } from '../../assets/icons/search.svg'
import {User} from "@/types/test";
import {api} from "@/api/api";

export default function AccountTeacherPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [name, setName] = useState('')
    const [students, setStudents] = useState<User[]>([]);
    const [classStudent, setClassStudent] = useState('');
    const [studentsError, setStudentsError] = useState<string |null>(null);

    useEffect(() => {
        api.get<User[]>('/students')
            .then(setStudents)
            .catch(()=>setStudentsError('Не удалось загрузить список учеников'))
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

    if (loading || user === null || user.role !== 'teacher') return null

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>{user.name}</h1>
            <div className={styles.seach}>
                <div className={styles.subtitle}>Поиск учеников</div>
                <div className={styles.block}>
                    <div className={styles.inputs}>
                        <div className={styles.input}>
                            <Input placeholder={'Начните вводить имя*'} value={name} onChange={setName} />
                            <Search className={styles.icon}/>
                        </div>
                        <div className={styles.inputClass}>
                            <Input placeholder={'введите класс'} type={'number'} value={classStudent} onChange={setClassStudent} />
                        </div>
                    </div>
                    {hasQuery && (
                        filteredStudents.length === 0 ?
                            <div>Никого не нашлось</div>
                            :(
                                <ul>
                                    {filteredStudents.map(student => (
                                        <li key={student.id}>{student.name}</li>
                                    ))}
                                </ul>
                            )
                    )
                    }
                </div>
            </div>
        </div>
    )
}
