import { useEffect } from "react";
import styles from "./Modal.module.scss"
import Button from "@/ui/Button/Button";

type ModalProps ={
    open?: boolean,
    title?: string,
    confirmText?: string,
    cancelText?: string,
    onConfirm?: () => void,
    onCancel?: () => void,
}

export default function Modal({open, title, confirmText = 'Да, завершить', cancelText = 'Отмена', onConfirm, onCancel}: ModalProps){
    useEffect(() => {
        if (!open) return
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [open])

    if(!open) return null

    return (
        <div className={styles.overlay}>
            <div className={styles.window}>
                <div className={styles.title}>{title}</div>
                <div className={styles.actions}>
                    {onCancel &&
                    <Button variant={'secondary'} onClick={onCancel}>{cancelText}</Button>
                    }
                    {onConfirm &&
                    <Button variant={'primary'} onClick={onConfirm}>{confirmText}</Button>
                    }
                </div>
            </div>
        </div>
    )
}