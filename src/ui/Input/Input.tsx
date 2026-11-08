import styles from './Input.module.scss'

type InputProps = {
    label?: string,
    placeholder?: string,
    type?: 'text' | 'email' | 'password' | 'number',
    value: string,
    onChange: (value: string) => void,
    variant?: 'label' | 'blue'
}

export default function Input({label, placeholder, type = 'text', value, onChange, variant='label'}:InputProps) {
    return (
        <div className={styles.wrap}>
            {label && <span className={`${styles[variant]}`}>{label}</span>}
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
