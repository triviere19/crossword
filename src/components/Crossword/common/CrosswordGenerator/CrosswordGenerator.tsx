"use client"

import { CSSProperties, useState } from "react";
import PuzzleSelector from "./PuzzleSelector/PuzzleSelector";
import { defaultCrosswordGeneratorOptions } from "@/models/Crossword";
import PuzzleLoading from "./PuzzleLoading/PuzzleLoading";
import { Alert, Button, Typography, useMediaQuery, useTheme } from "@mui/material";
import styles from "./CrosswordGenerator.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCrossword } from "@/context/CrosswordContext";
import CrosswordMobile from "../../v3/CrosswordMobile/CrosswordMobile";
import CrosswordDesktop from "../../v3/CrosswordDesktop/CrosswordDesktop";

export default function CrosswordGenerator(){

    const { setLayout, layout } = useCrossword();
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [generating, setGenerating] = useState(false);
    const [generated, setGenerated] = useState(false);
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

    const buttonStyle: CSSProperties = {
        width: 300,
    }

    return (
        <>
            { generated ? 
                isMobile ? <CrosswordMobile/> : <CrosswordDesktop/> 
                :
                generating ? 
                    <PuzzleLoading/>
                    :
                    <div className={styles.selector_container}>
                        <Image
                            src="/icons/logo.svg"
                            width={100}
                            height={100}
                            alt="crossword.tyriviere"
                        />
                        <Typography variant="h3" textAlign={"center"}>AI Crossword Generator</Typography>
                        <PuzzleSelector difficulties={difficulties} value={options} onChange={setOptions}/>
                        <Button onClick={handleGenerate} sx={buttonStyle} variant="contained">Generate</Button>
                        <Button sx={buttonStyle} variant="outlined" onClick={()=>router.push("/admin/home")}>Back</Button>
                        { error && <Alert>{error}</Alert>}
                    </div>
            }
        </>
    );
}