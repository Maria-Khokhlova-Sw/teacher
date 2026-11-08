'use client'
import { useState, useRef, useEffect } from 'react'
import styles from './Select.module.scss'
import { ReactComponent as Arrow } from '../../assets/icons/arrow.svg'


export type SelectOption = {
    value: string
    label: string
}

type SelectProps = {
    value: string
    options: SelectOption[]
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    disabled?: boolean
}

export default function Select({
                                   value,
                                   options,
                                   onChange,
                                   label,
                                   placeholder = 'Выберите...',
                                   disabled = false,
                               }: SelectProps) {
    const [open, setOpen] = useState(false)
    const rootRef = useRef<HTMLDivElement>(null)

    const selected = options.find(o => o.value === value)

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === 'Escape') setOpen(false)
        }
        if (open) {
            document.addEventListener('keydown', handleKey)
            return () => document.removeEventListener('keydown', handleKey)
        }
    }, [open])

    function handleSelect(optionValue: string) {
        onChange(optionValue)
        setOpen(false)
    }

    return (
        <div className={styles.wrapper} ref={rootRef}>
            {label && <label className={styles.label}>{label}</label>}

            <button
                type="button"
                className={styles.trigger}
                onClick={() => !disabled && setOpen(prev => !prev)}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
            >
                <span className={selected ? styles.value : styles.placeholder}>
                    {selected ? selected.label : placeholder}
                </span>
                <span className={`${styles.arrow} ${open ? styles.arrowOpen : ''}`}>
                    <Arrow/>
                </span>
            </button>

            {open && (
                <ul className={styles.dropdown} role="listbox">
                    {options.map(option => (
                        <li
                            key={option.value}
                            role="option"
                            aria-selected={option.value === value}
                            className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}