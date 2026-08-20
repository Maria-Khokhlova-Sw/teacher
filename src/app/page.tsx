import styles from "@/app/page.module.css";
import Tag from "@/ui/Tag/Tag";

export default function Home() {
    return (
        <div className={styles.container}>
            <Tag variant={'light-blue'} text={'Верно'}/>
            <Tag text={'Неверно'}/>
            <Tag variant={'red'} text={'Новая тема'}/>
            <Tag variant={'gray'} text={'Черновик'}/>
        </div>
    );
}
