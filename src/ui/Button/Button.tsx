import styles from './Button.module.scss'

type ButtonProps = {
    type?: 'button' | 'submit' | 'reset',
    disabled?: boolean,
    variant?: 'primary' | 'secondary' | 'text',
    children: React.ReactNode
}

export default function Button({type = 'button', children, disabled, variant= 'primary'}:ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            className={`${styles.btn} ${styles[variant]}`}
        >
            {children}
        </button>
    )
}