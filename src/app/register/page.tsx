'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Input from '@/ui/Input/Input'
import Button from '@/ui/Button/Button'
import styles from './register.module.scss'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

type FieldErrors = {
    name?: string
    email?: string
    password?: string
    class?: string
}

type ValidationErrorResponse = {
    message?: string
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        class?: string[]
    }
}

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
    const [classNumber, setClassNumber] = useState('')
    const [errors, setErrors] = useState<FieldErrors>({})
    const { register } = useAuth()
    const router = useRouter()

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()
        setErrors({})

        const nextErrors: FieldErrors = {}

        if (!name.trim()) {
            nextErrors.name = 'Поле «имя» обязательно для заполнения.'
        }
        if (!email.trim()) {
            nextErrors.email = 'Поле «email» обязательно для заполнения.'
        }
        if (!password) {
            nextErrors.password = 'Поле «пароль» обязательно для заполнения.'
        } else if (password !== passwordRepeat) {
            nextErrors.password = 'Пароли должны совпадать'
        }
        if (!classNumber || Number(classNumber) < 1 || Number(classNumber) > 12) {
            nextErrors.class = 'Поле «класс» должно быть от 1 до 12.'
        }

        if (Object.keys(nextErrors).length > 0) {
            setErrors(nextErrors)
            return
        }

        try {
            await register(name, email, password, Number(classNumber))
            router.push('/')
        } catch (err: unknown) {
            const errorData = err as ValidationErrorResponse

            if (errorData?.errors) {
                setErrors({
                    name: errorData.errors.name?.[0],
                    email: errorData.errors.email?.[0],
                    password: errorData.errors.password?.[0],
                    class: errorData.errors.class?.[0],
                })
            } else if (err instanceof Error) {
                setErrors({ name: err.message })
            } else {
                setErrors({ name: 'Не удалось зарегистрироваться' })
            }
        }
    }

    return (
        <div className={styles.wrapper}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.title}>Регистрация</div>

                <Input
                    label="Имя"
                    placeholder="Как вас зовут"
                    value={name}
                    onChange={setName}
                />
                {errors.name && <div className={styles.error}>{errors.name}</div>}

                <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={setEmail}
                />
                {errors.email && <div className={styles.error}>{errors.email}</div>}

                <Input
                    label="Пароль"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                />
                {errors.password && <div className={styles.error}>{errors.password}</div>}

                <Input
                    label="Повторите пароль"
                    type="password"
                    placeholder="••••••••"
                    value={passwordRepeat}
                    onChange={setPasswordRepeat}
                />

                <Input
                    label="Класс. Если вы студент укажите 12"
                    placeholder="Укажите класс обучения"
                    value={classNumber}
                    onChange={setClassNumber}
                />
                {errors.class && <div className={styles.error}>{errors.class}</div>}

                <Button type="submit" variant="primary">
                    Зарегистрироваться
                </Button>
                <span className={styles.hint}>
                    Забыли пароль? <Link href="/login">Восстановить пароль</Link>
                </span>
                <span className={styles.hint}>
                    Уже есть аккаунт? <Link href="/login">Войти</Link>
                </span>
            </form>
        </div>
    )
}