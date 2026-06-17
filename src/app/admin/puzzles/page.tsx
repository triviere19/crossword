"use client"

import PuzzleTable from "@/components/PuzzleTable/PuzzleTable";
import styles from "../../page.module.css";
import { useEffect, useState } from "react";
import { CrosswordEntry } from "@/models/Crossword";
import { Alert, Button, Typography } from "@mui/material";
import PuzzleLoading from "@/components/Crossword/common/CrosswordGenerator/PuzzleLoading/PuzzleLoading";
import { Add, Replay } from "@mui/icons-material";

export default function Puzzles() {

    const [errorMsg, setErrorMsg] = useState<string|undefined>(undefined);
    const error = Boolean(errorMsg);
    const [loading, setLoading] = useState(true);
    const [puzzles, setPuzzles] = useState<CrosswordEntry[]>([]);

    const fetchPuzzles = () => {
        setLoading(true);
        fetch('/api/puzzles').then((res) => res.json()).then((data) => {
            if(data.error){
                setErrorMsg(data.error);
                setLoading(false);
                return;
            }
            setLoading(false);
            console.log(data);
            setPuzzles(data);
        });
    }

    useEffect(() => {
        fetchPuzzles();
    }, []);

    const handleCreatePuzzle = () => {
        fetchPuzzles();
    }

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                {
                    error ?
                        <div className={styles.center_group}>
                            <Alert severity="error">
                                {errorMsg}
                            </Alert>
                            <Button variant="outlined" onClick={fetchPuzzles}>
                                <Replay/>&nbsp;Try Again
                            </Button>
                        </div> 
                    : 
                    loading ?
                        <PuzzleLoading/>
                    : 
                        <div className={styles.center_group}>
                            { puzzles.length ? 
                                <PuzzleTable puzzles={puzzles}/>
                                :
                                <Typography>No puzzles found</Typography>
                            }
                            <Button variant="outlined" onClick={handleCreatePuzzle}>
                                <Add/>&nbsp;Create Puzzle
                            </Button>
                        </div>
                }
            </main>
        </div>
    );
}
