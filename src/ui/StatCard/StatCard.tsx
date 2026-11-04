import styles from './StatCard.module.scss'

type StatCardProps = {
    label: string,
    value: string,
    description: string,
}

export default function StatCard({label, value, description}:StatCardProps) {
    return (
        <div className={styles.card}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
            <span className={styles.description}>{description}</span>
        </div>
    )
}
