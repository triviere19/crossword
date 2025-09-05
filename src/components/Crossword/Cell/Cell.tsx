import { CrosswordCellState } from "@/models/Crossword";
import styles from "./Cell.module.css";
import { KeyboardEvent, MouseEvent, Ref } from "react";


export interface CellProps {
    number?: number | undefined,
    value: string,
    state: CrosswordCellState,
    size: number,
    answer: string,
    onChange?: (set: string) => void,
    onFocus?: () => void,
    onClick?: (event: MouseEvent) => void,
    onBlur?: () => void,
    onKeyDown?: (event: KeyboardEvent) => void,
    highlighted?: boolean,
    ref?: Ref<HTMLInputElement>,
    id?: string,
}


export default function Cell(props: CellProps){

    let stateClassName = "";
    switch(props.state){
        default: stateClassName = styles.normal; break; 
        case "correct": stateClassName = styles.correct; break;
        case "incorrect": stateClassName = styles.incorrect; break;
        case "inactive": stateClassName = styles.inactive; break;
    }

    return (
        <div className={styles.container}>
            <input 
                className={`${styles.cell} ${stateClassName} ${props.highlighted ? styles.highlighted : ""}`}
                style={{
                    width: `${props.size}px`,
                    height: `${props.size}px`,
                    fontSize: `${props.size * 0.65}px`, /** chat says most font' letters fit in 70-80% of a pixel */
                }}
                // defaultValue={props.answer == "-" ? "" : props.answer.toUpperCase()}
                value={props.value}
                disabled={props.answer == "-"}
                onChange={(e) => props.onChange?.(e.target.value.charAt(e.target.value.length-1).toUpperCase())}
                onClick={props.onClick}
                onFocus={props.onFocus}
                onBlur={props.onBlur}
                onKeyDown={props.onKeyDown}
                ref={props.ref}
                id={props.id}
            />
            <div 
                className={styles.number}
                style={{
                    fontSize:`${props.size*0.25}px`,
                }}
            >{props.number}</div>
        </div>
    );
}