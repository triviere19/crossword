"use client"

import styles from "./CrosswordDesktop.module.css";
import Word from "../../Crossword/Word/Word";
import Logo from "../../Logo/Logo";
import TimerIcon from '@mui/icons-material/Timer';
import CheckButton from "../../CheckButton/CheckButton";
import PuzzleSolvedModal from "../../Crossword/PuzzleSolvedModal/PuzzleSolvedModal";
import { formatTimer } from "@/utils/time";
import { Button } from "@mui/material";
import { useCrossword } from "@/context/CrosswordContext";
import CrosswordPuzzle from "../CrosswordPuzzle/CrosswordPuzzle";

export interface CrosswordDesktopProps{

}

export default function CrosswordDesktop(props: CrosswordDesktopProps){

    const { layout,
        timer,
        solved,
        focusedWordId,
        checkPuzzle,
    } = useCrossword();

    return (
        <>
            {/* =========================================================================== */}
            {/* HEADER */}

            <div className={styles.header}>
                <div className={styles.header_title}>
                    <p className={styles.header_title_text}>t y r i v i e r e . c o m</p>
                    <Logo height={30}/>
                </div>
                <div className={styles.header_buttons}>
                    <div className={styles.timer}><TimerIcon/>{formatTimer(timer)}</div>
                    <CheckButton className={styles.button} onClick={checkPuzzle}/>
                </div>
            </div>

            {/* =========================================================================== */}
            {/* PUZZLE */}

            <div className={styles.container}>

                <CrosswordPuzzle className={styles.puzzle}/>

                {/* =========================================================================== */}
                {/* CLUES */}
            
                <div className={styles.clues}>
                    <div className={styles.clues}>
                        <h4 className={styles.clues_title}>{`ACROSS`}</h4>
                        {/* <div className={styles.divider}/> */}
                        { layout?.words.filter(clue => clue.orientation == "across").map((clue, i) => (
                            <Word number={clue.position} clue={clue.clue} highlighted={clue.id == focusedWordId} key={i}/>
                        ))}
                    </div>
                    <div className={styles.divider}/>
                    <div className={styles.clues}>
                        <h4 className={styles.clues_title}>{`DOWN`}</h4>
                        {/* <div className={styles.divider}/> */}
                        { layout?.words.filter(clue => clue.orientation == "down").map((clue, i) => (
                            <Word number={clue.position} clue={clue.clue} highlighted={clue.id == focusedWordId} key={i}/>
                        ))}
                    </div>
                </div>

                {/* =========================================================================== */}

                <PuzzleSolvedModal solved={solved} time={timer}>
                    <Button onClick={()=>window.location.reload()}>New Puzzle</Button>
                </PuzzleSolvedModal>

                {/* =========================================================================== */}

            </div>

        </>
    );
}