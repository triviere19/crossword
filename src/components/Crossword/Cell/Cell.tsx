import { CrosswordCellState } from "@/models/Crossword";
import styles from "./Cell.module.css";
import { KeyboardEvent } from "react";


export interface CellProps {
    value: string,
    state: CrosswordCellState,
    size: number,
    answer: string,
    onChange?: (set: string) => void,
    onFocus?: () => void,
    onClick?: () => void,
    onBlur?: () => void,
    onKeyDown?: (event: KeyboardEvent) => void,
    highlighted?: boolean,
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
        <input 
            className={`${styles.cell} ${stateClassName} ${props.highlighted ? styles.highlighted : ""}`}
            style={{
                width: `${props.size}px`,
                height: `${props.size}px`,
                fontSize: `${props.size * 0.75}px`, /** chat says most font' letters fit in 70-80% of a pixel */
            }}
            // defaultValue={props.answer == "-" ? "" : props.answer.toUpperCase()}
            value={props.value}
            disabled={props.answer == "-"}
            onChange={(e) => props.onChange?.(e.target.value.charAt(e.target.value.length-1).toUpperCase())}
            onClick={props.onClick}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            onKeyDown={props.onKeyDown}
        />
    );
}