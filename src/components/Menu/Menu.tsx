import styles from './Menu.module.scss';

export  default  function Menu(){
    return (
        <div className={styles.menu}>
            <div className={styles.links}>
                <div className={styles.link}>
                    Главная
                </div>
                <div className={styles.link}>
                    Случайный вариант
                </div>
            </div>
            <div className={styles.link}>
                Личный кабинет
            </div>
        </div>
    )
}