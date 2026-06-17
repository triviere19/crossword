"use client"

import styles from "./DailyCrosswordPuzzle.module.css";
import React from "react";
import { useCrossword } from "../../common/CrosswordContext/CrosswordContext";
import PuzzleLoading from "../../common/CrosswordGenerator/PuzzleLoading/PuzzleLoading";
import { Alert, Button, useMediaQuery, useTheme } from "@mui/material";
import CrosswordMobile from "../CrosswordMobile/CrosswordMobile";
import CrosswordDesktop from "../CrosswordDesktop/CrosswordDesktop";
import { Replay } from "@mui/icons-material";
import { GetDailyPuzzleResult } from "@/app/api/daily-puzzle/route";
import PuzzleSolvedModal from "../../common/PuzzleSolvedModal/PuzzleSolvedModal";
import Link from "next/link";

export default function DailyCrosswordPuzzle(): React.JSX.Element {

    const { setLayout, layout, solved, timer } = useCrossword();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [errorMsg, setErrorMsg] = React.useState<string|undefined>(undefined);
    const error = Boolean(errorMsg);
    const [loading, setLoading] = React.useState(true);

    const fetchPuzzle = async () => {
        setLoading(true);
        setErrorMsg(undefined);
        await fetch("/api/daily-puzzle").then(async (res) => {
            if(res.ok){
                const result: GetDailyPuzzleResult = await res.json();
                if(result.layout){
                    console.log(result);
                    setLayout(result.layout);
                    setLoading(false);
                } else {
                    throw(`Could not generate crossword puzzle! No layout returned!`);
                }
            } else {
                throw(`Could not generate crossword puzzle! (${res.status} - ${res.statusText})`);
            }
        }).catch((e) => {
            console.error(e);
            setErrorMsg(e);
        }).finally(() => {
            setLoading(false);
        });
    }

    React.useEffect(() => {
        fetchPuzzle();
    }, []);
    
    if (loading) return <PuzzleLoading/>;

    else if (error) return (
        <div className={styles.center_group}>
            <Alert severity="error">
                {errorMsg}
            </Alert>
            <Button variant="outlined" onClick={fetchPuzzle}>
                <Replay/>&nbsp;Try Again
            </Button>
        </div> 
    );

    else if (layout){
        return (
            <>
                <PuzzleSolvedModal solved={solved} time={timer}>
                    <Button variant="contained" component={Link} href="/">Home</Button>
                </PuzzleSolvedModal>
                { isMobile ? <CrosswordMobile/> : <CrosswordDesktop/> }
            </>
        )
    }

    else return <></>;

}