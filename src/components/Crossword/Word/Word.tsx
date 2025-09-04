import { CSSProperties } from "react";
import styles from "./Word.module.css";

export interface WordProps {
    number: number,
    clue: string,
    highlighted?: boolean,
    disabled?: boolean,
    className?: string,
    style?: CSSProperties,
}

export default function Word(props: WordProps){

    return ( 
        <div className={`${styles.clue} ${props.disabled ? styles.disabled : props.highlighted ? styles.highlighted : ""}`}>
            <p className={styles.number}>{`${props.number}.`}</p>
            <p>{props.clue}</p>
        </div>
    );
}