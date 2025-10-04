"use client"

import { useState } from "react";
import PuzzleSelector from "./PuzzleSelector/PuzzleSelector";
import { CrosswordLayout, defaultCrosswordGeneratorOptions } from "@/models/Crossword";
import CrosswordPuzzle from "../v3/CrosswordPuzzle/CrosswordPuzzle";
import PuzzleLoading from "./PuzzleLoading/PuzzleLoading";


export default function CrosswordGenerator(){

    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
    const [layout, setLayout] = useState<CrosswordLayout|undefined>(undefined);

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
        await fetch("/api/crossword/v3").then(async (res) => {
            setGenerating(false);
            if(res.ok){
                const result = await res.json();
                if(result.layout){
                    setLayout(result.layout);
                    setGenerated(true);
                } else {
                    console.error(`No layout!`);
                }
            } else {
                console.error(`Bad response!`);
            }
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
                    <>
                        <PuzzleSelector difficulties={difficulties} value={options} onChange={setOptions}/>
                        <button onClick={handleGenerate}>Generate</button>
                    </>
            }
        </>
    );
}