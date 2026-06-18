import styles from "./Modal.module.css";
import { CSSProperties, ReactNode } from "react";


export interface ModalProps {
    open: boolean,
    title?: string,
    children?: ReactNode,
    className?: string,
    style?: CSSProperties,

}

export default function Modal({children, ...props}: ModalProps){
    return (
        <div 
            className={styles.overlay}
            style={{
                opacity: props.open ? 1 : 0,
                pointerEvents: props.open ? 'all' : 'none',
            }}
        >
            <div className={`${styles.modal} ${props.className}`} style={{...props.style}}>
                { props.title && <h2>{props.title}</h2>}
                {children}
            </div>
        </div>
    );
}