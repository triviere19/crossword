import { Button, ButtonGroup, Slider, Typography } from "@mui/material";
import { CSSProperties, useEffect, useState } from "react";
import styles from "./PuzzleSelector.module.css";
import { CrosswordGeneratorOptions } from "@/models/Crossword";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

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

    const buttonStyle: CSSProperties = {
        borderRadius: 20,
        padding: "0.25rem",
    }

    return (
        <div className={styles.pair}>
            <Typography>{props.label}</Typography>
            <ButtonGroup>
                <Button variant="contained" sx={buttonStyle} onClick={handleDecrement}>
                    <RemoveIcon/>
                </Button>
                <Button variant="outlined" disableRipple>{props.value}</Button>
                <Button variant="contained" sx={buttonStyle} onClick={handleIncrement}>
                    <AddIcon/>
                </Button>
            </ButtonGroup>
        </div>
    );
}