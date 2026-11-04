'use client'
import styles from './Menu.module.scss';
import {usePathname} from "next/navigation";
import Link from "next/link";
import {useAuth} from "@/context/AuthContext";

const HIDDEN_ON = ['/login', '/register']

export  default  function Menu(){
    const pathname = usePathname()
    const {user, logout, loading} = useAuth()

    if (HIDDEN_ON.includes(pathname)) {
        return null
    }

    if (loading) return null

    return (
        user ? (
            <div className={styles.menu}>
                <div className={styles.links}>
                    <Link href="/" className={pathname === '/' ? styles.active : styles.link}>Главная</Link>
                    <Link href="/test" className={pathname === '/test' ? styles.active : styles.link}>Случайный вариант</Link>
                </div>
                <div className={styles.links}>
                    {user.role === 'student' ? (
                        <Link href="/account" className={pathname === '/account' ? styles.active : styles.link}>{user.name}</Link>
                    ) : (
                        <Link href="/account-teacher" className={pathname === '/account-teacher' ? styles.active : styles.link}>{user.name}</Link>
                    )}
                    <button className={styles.logout} onClick={() => logout()}>Выйти</button>
                </div>
            </div>
        ):(
            <div className={styles.login}>
                <Link href="/login" className={styles.link}>Войти</Link>
                <Link href="/register" className={styles.link}>Регистрация</Link>
            </div>
        )

    )
}