'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Input from '@/ui/Input/Input'
import Button from '@/ui/Button/Button'
import styles from './restore.module.scss'
import {useAuth} from "@/context/AuthContext";
import {useRouter} from "next/navigation";

export default function RestorePage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const {login} = useAuth()
    const router = useRouter()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setError(null)
        try {
            await login(email, password)
            router.push('/')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Не удалось войти')
        }
    }

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.title}>Восстановить пароль</div>
                {error && <div className={styles.error}>{error}</div>}
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
                    label="Повторите пароль"
                    type="password"
                    placeholder="••••••••"
                    value={passwordRepeat}
                    onChange={setPasswordRepeat}
                />
                <Button type={'submit'} variant={'primary'}>Войти</Button>
                <span className={styles.hint}>
                    Нет аккаунта? <Link href={'/register'}>Зарегистрироваться</Link>
                </span>
            </form>
        </div>
    )
}
