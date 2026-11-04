import styles from './Button.module.scss'

type ButtonProps = {
    type?: 'button' | 'submit' | 'reset',
    disabled?: boolean,
    variant?: 'primary' | 'secondary' | 'text',
    onClick?: () => void,
    children: React.ReactNode
}

export default function Button({type = 'button', children, disabled, variant= 'primary', onClick}:ButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`${styles.btn} ${styles[variant]}`}
        >
            {children}
        </button>
    )
}