import styles from "@/app/account/teacher/account-teacher.module.scss";
import CreateTest from "@/components/CreateTest/CreateTest";

export default function TestCreatePage(){
    return(
        <div className={styles.wrapper}>
            <CreateTest/>
        </div>
    )
}
