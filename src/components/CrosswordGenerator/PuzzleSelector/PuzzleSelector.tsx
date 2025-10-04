import { Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./PuzzleSelector.module.css";
import { CrosswordGeneratorOptions } from "@/models/Crossword";


export interface PuzzleSelectorProps {
    difficulties: string[],
    value: CrosswordGeneratorOptions,
    onChange: (set: CrosswordGeneratorOptions) => void,
}

export default function PuzzleSelector(props: PuzzleSelectorProps){

    const [difficulty, setDifficulty] = useState(0);
    const [blanks, setBlanks] = useState(2);
    const [rows, setRows] = useState(5);
    const [cols, setCols] = useState(5);

    useEffect(() => {
        props.onChange({
            difficulty: props.difficulties[difficulty],
            blanks, rows, cols,
        })
    }, [difficulty, blanks, rows, cols]);

    return (
        <div className={styles.container}>
            <Incrementor value={blanks} onChange={setBlanks} label={"Blank Spaces:"} min={0}/>
            <Incrementor value={rows} onChange={setRows} label={"Rows:"} min={1} max={8}/>
            <Incrementor value={cols} onChange={setCols} label={"Cols:"} min={1} max={8}/>
            <div className={styles.block}>
                <div className={styles.label_container}>
                    <Typography className={styles.label}>{"Difficulty:"}</Typography>
                    <Typography className={styles.difficulty}>{props.difficulties[difficulty]}</Typography>
                </div>
                <Slider
                    marks
                    min={0}
                    max={props.difficulties.length - 1}
                    value={difficulty}
                    onChange={(e, val)=>setDifficulty(val)}
                    sx={{ width: '300px', }}
                />
            </div>
        </div>
    );
}

export interface IncrementorProps {
    label: string,
    value: number,
    onChange: (set: number) => void,
    min?: number,
    max?: number,
}

export function Incrementor(props: IncrementorProps){

    const min = props.min != undefined ? props.min : 0;
    const max = props.max != undefined ? props.max : 10;

    const handleIncrement = () => {
        if(props.value < max){
            props.onChange(props.value+1);
        }
    }

    const handleDecrement = () => {
        if(props.value > min){
            props.onChange(props.value-1);
        }
    }

    return (
        <div className={styles.pair}>
            <Typography>{props.label}</Typography>
            <div className={styles.incrementor}>
                <button className={styles.incrementor_button} onClick={handleDecrement}>-</button>
                <Typography>{props.value}</Typography>
                <button className={styles.incrementor_button} onClick={handleIncrement}>+</button>
            </div>
        </div>
    );
}