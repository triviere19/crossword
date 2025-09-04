import styles from "./Logo.module.css";

export interface LogoProps {
    height?: number,
}

export default function Logo(props: LogoProps){

    const letters = Array.from("CROSSWORD");
    const cellSize = props.height || 20;
    const nRows = 1;
    const nCols = letters.length;

    return (
        <div 
            className={styles.container} 
            style={{
                gridTemplateColumns: `repeat(${nCols}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${nRows}, ${cellSize}px)`,
                width: `${cellSize * nCols}px`,
                height: `${cellSize * nRows}px`,
            }}
        >
            { letters.map((letter, i) => (
                <input 
                    className={`${styles.cell} ${i <= 4 && styles.cell_filled}`} 
                    style={{
                        fontSize: cellSize * .75,
                    }}
                    key={i}
                    value={letter}
                    disabled
                />
            ))}
        </div>
    );
}