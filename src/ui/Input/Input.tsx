import styles from './Input.module.scss'

type InputProps = {
    label?: string,
    placeholder?: string,
    type?: 'text' | 'email' | 'password' | 'number',
    value: string,
    onChange: (value: string) => void,
}

export default function Input({label, placeholder, type = 'text', value, onChange}:InputProps) {
    return (
        <div className={styles.wrap}>
            {label && <span className={styles.label}>{label}</span>}
            <input
                type={type}
                className={styles.input}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}
