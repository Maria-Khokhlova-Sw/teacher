import styles from './Checkbox.module.scss'

type CheckboxProps = {
    label: string,
    checked?: boolean,
    onChange: (checked: boolean) => void,
    type?: 'radio' | 'checkbox',
    name?: string,
}

export default function Checkbox({label, checked = false, onChange, type = 'checkbox', name}:CheckboxProps) {
    return (
        <label className={styles.wrap}>
            <input
                type={type}
                name={name}
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                className={styles.input}
            />
            <span className={styles.indicator} />
            <span className={styles.label}>{label}</span>
        </label>
    )
}
