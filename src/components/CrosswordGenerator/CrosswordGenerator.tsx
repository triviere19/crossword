"use client"

import { useState } from "react";
import PuzzleSelector from "./PuzzleSelector/PuzzleSelector";
import { CrosswordLayout, defaultCrosswordGeneratorOptions } from "@/models/Crossword";
import CrosswordPuzzle from "../v3/CrosswordPuzzle/CrosswordPuzzle";
import PuzzleLoading from "./PuzzleLoading/PuzzleLoading";
import { Alert, Typography } from "@mui/material";
import styles from "./CrosswordGenerator.module.css";

export default function CrosswordGenerator(){

    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [layout, setLayout] = useState<CrosswordLayout|undefined>(undefined);
    const [error, setError] = useState<string|undefined>(undefined);

    const [options, setOptions] = useState(defaultCrosswordGeneratorOptions);
    const difficulties = [
        "sack of potatoes",
        "2 year old",
        "5 year old",
        "5th grader",
        "high schooler",
        "average human being",
        "college graduate",
        "harvard graduate",
        "phd student",
        "nobel peace prize winner",
    ];

    const handleGenerate = async () => {
        setGenerating(true);
        setError(undefined);
        await fetch("/api/crossword/v3", {
            headers: {
                'rows': options.rows.toString(), 'cols': options.cols.toString(), 
                'blanks': options.blanks.toString(), 'difficulty': options.difficulty
            },
        }).then(async (res) => {
            if(res.ok){
                const result = await res.json();
                if(result.layout){
                    setLayout(result.layout);
                    setGenerated(true);
                } else {
                    throw(`Could not generate crossword puzzle! No layout returned!`);
                }
            } else {
                throw(`Could not generate crossword puzzle! (${res.status} - ${res.statusText})`);
            }
        }).catch((e) => {
            console.error(e);
            setError(e);
        }).finally(() => {
            setGenerating(false);
        });
    }

    return (
        <>
            { generated ? 
                <CrosswordPuzzle layout={layout}/>
                :
                generating ? 
                    <PuzzleLoading/>
                    :
                    <div className={styles.selector_container}>  
                    <PuzzleLoading/>
                        <Typography variant="h3">AI Crossword Generator</Typography>
                        <PuzzleSelector difficulties={difficulties} value={options} onChange={setOptions}/>
                        <button onClick={handleGenerate} className={styles.button}>Generate</button>
                        { error && <Alert>{error}</Alert>}
                    </div>
            }
        </>
    );
}