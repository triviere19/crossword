"use client"

import styles from "./CrosswordPuzzle.module.css";
import { CrosswordLayout } from "@/models/Crossword";
import { useEffect, useRef, useState } from "react";
import Cell from "../Crossword/Cell/Cell";


export default function CrosswordPuzzle(){

    const [layout, setLayout] = useState<CrosswordLayout|undefined>(undefined);
    const puzzle = useRef<HTMLDivElement|null>(null);

    useEffect(() => {
        fetch("/api/crossword/v1").then(async (res) => {
            const result = await res.json();
            if(res.ok){
                setLayout(result.layout);
            } else {
                console.error(res.status, result.error);
            }
        });
    }, []);

    const numRows = (layout?.table) ? (
        layout.table.length
    ) : 1;

    const numCols = (layout?.table && layout.table.length) ? (
        layout.table[0].length
    ) : 1;

    const cellSize = (puzzle.current) ? (
        Math.min(puzzle.current.offsetWidth / numCols, puzzle.current.offsetHeight / numRows)
    ) : 1;

    return (
        <>
            <div className={styles.header}>
                <div className={styles.header_title}>
                    <p>tyriviere.com</p>
                    <h2>CROSSWORD</h2>
                </div>
                <div className={styles.header_buttons}>
                    <button className={styles.button}>CHECK</button>
                </div>
            </div>

            <div className={styles.container}>

                <div className={styles.puzzle} ref={puzzle}>
                    <div 
                        className={styles.grid}
                        style={{
                            gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
                            gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
                            width: `${cellSize * numCols}px`,
                            height: `${cellSize * numRows}px`,
                        }}
                    >
                        { layout && layout.table.map((row) => (
                            row.map((cell, cellIndex) => (
                                <Cell 
                                    key={cellIndex} 
                                    size={cellSize}
                                    answer={cell}
                                    onChange={(value)=>console.log(value)}
                                />
                            ))
                        ))}
                    </div>
                </div>
            
                <div className={styles.clues}>
                    <div className={styles.clues}>
                        <h4>{`ACROSS`}</h4>
                        {/* <div className={styles.divider}/> */}
                        { layout?.result.filter(clue => clue.orientation == "across").map((clue, i) => (
                            <div className={styles.clue} key={i}>
                                <p>{`${clue.position}. ${clue.clue}`}</p>
                            </div>
                        ))}
                    </div>
                    <div className={styles.divider}/>
                    <div className={styles.clues}>
                        <h4>{`DOWN`}</h4>
                        {/* <div className={styles.divider}/> */}
                        { layout?.result.filter(clue => clue.orientation == "down").map((clue, i) => (
                            <div className={styles.clue} key={i}>
                                <p>{`${clue.position}. ${clue.clue}`}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

        </>
    );
}