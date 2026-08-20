import styles from './Tag.module.scss'

type TagProps = {
    text: string,
    variant?: 'blue' | 'red' | 'gray' | 'light-blue',
}

export default function Tag({text, variant='blue'}:TagProps) {
    return (
        <div
            className={`${styles.tag} ${styles[variant]}`}
        >
            {text}
        </div>
    )
}