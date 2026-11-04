import styles from './ProgressBar.module.scss'

type ProgressBarProps = {
    percent: number,
}

export default function ProgressBar({percent}:ProgressBarProps) {
    return (
        <div className={styles.track}>
            <div className={styles.fill} style={{width: `${percent}%`}} />
        </div>
    )
}
