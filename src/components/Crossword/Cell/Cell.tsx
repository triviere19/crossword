import styles from "./Cell.module.css";


export interface CellProps {
    size: number,
    answer: string,
    onChange?: (set: string) => void,
}


export default function Cell(props: CellProps){

    return (
        <input 
            className={`${styles.cell} ${props.answer == "-" ? styles.cell_filled : ""}`}
            style={{
                width: `${props.size}px`,
                height: `${props.size}px`,
                fontSize: `${props.size * 0.75}px`, /** chat says most font' letters fit in 70-80% of a pixel */
            }}
            defaultValue={props.answer == "-" ? "" : props.answer.toUpperCase()}
            disabled={props.answer == "-"}
            onChange={(e) => props.onChange?.(e.target.value.charAt(e.target.value.length-1).toUpperCase())}
        />
    );
}