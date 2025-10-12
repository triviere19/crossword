"use client"

import styles from "./CrosswordMobile.module.css";
import TimerIcon from '@mui/icons-material/Timer';
import CheckButton from "../../../CheckButton/CheckButton";
import PuzzleSolvedModal from "../../common/PuzzleSolvedModal/PuzzleSolvedModal";
import { formatTimer } from "@/utils/time";
import { Button, Typography } from "@mui/material";
import { useCrossword } from "@/components/Crossword/common/CrosswordContext/CrosswordContext";
import CrosswordPuzzle from "../CrosswordPuzzle/CrosswordPuzzle";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CrosswordWordLayout } from "@/models/Crossword";

export interface CrosswordMobileProps{

}

export default function CrosswordMobile(props: CrosswordMobileProps){

    const { layout,
        timer,
        solved,
        focusedWordId,
        checkPuzzle,
    } = useCrossword();

    const [focusedWord, setFocusedWord] = useState<CrosswordWordLayout|undefined>(undefined);

    useEffect(() => {
        setFocusedWord(layout?.words.find(word => word.id == focusedWordId));
    }, [focusedWordId]);

    return (
        <>
            {/* =========================================================================== */}
            {/* HEADER */}

            <div className={styles.header}>
                <Image
                    src="/icons/logo.svg"
                    width={50}
                    height={50}
                    alt={"crossword.tyriviere"}
                />
                <div className={styles.header_buttons}>
                    <div className={styles.timer}><TimerIcon/>{formatTimer(timer)}</div>
                    <CheckButton className={styles.button} onClick={checkPuzzle}/>
                </div>
            </div>

            {/* =========================================================================== */}
            {/* PUZZLE */}

            <div className={styles.container}>
                { focusedWord && 
                    <div className={styles.clue}>
                        <Typography>{`${focusedWord?.position}: ${focusedWord?.clue}`}</Typography>
                    </div>
                }
                <CrosswordPuzzle 
                    className={styles.puzzle}
                    style={{
                        width: focusedWordId ? "75%" : "100%",
                    }}
                />
            </div>

            {/* =========================================================================== */}

            <PuzzleSolvedModal solved={solved} time={timer}>
                <Button variant="contained" onClick={()=>window.location.reload()}>New Puzzle</Button>
            </PuzzleSolvedModal>

            {/* =========================================================================== */}


        </>
    );
}