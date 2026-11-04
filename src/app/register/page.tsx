'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Input from '@/ui/Input/Input'
import Button from '@/ui/Button/Button'
import styles from './register.module.scss'
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [classNumber, setClassNumber] = useState('')
    const [error, setError] = useState<string | null>(null)
    const {register} = useAuth()
    const router = useRouter()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        try {
            await register(name, email, password, Number(classNumber))
            router.push('/account')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось зарегистрироваться')
        }
    }

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.title}>Регистрация</div>
                {error && <div className={styles.error}>{error}</div>}
                <Input
                    label={'Имя'}
                    placeholder={'Как вас зовут'}
                    value={name}
                    onChange={setName}
                />
                <Input
                    label={'Email'}
                    type={'email'}
                    placeholder={'you@example.com'}
                    value={email}
                    onChange={setEmail}
                />
                <Input
                    label={'Пароль'}
                    type={'password'}
                    placeholder={'••••••••'}
                    value={password}
                    onChange={setPassword}
                />
                <Input
                    label={'Класс'}
                    placeholder={'Укажите класс обучения'}
                    value={classNumber}
                    onChange={setClassNumber}
                />
                <Button type={'submit'} variant={'primary'}>Зарегистрироваться</Button>
                <span className={styles.hint}>
                    Уже есть аккаунт? <Link href={'/login'}>Войти</Link>
                </span>
            </form>
        </div>
    )
}
