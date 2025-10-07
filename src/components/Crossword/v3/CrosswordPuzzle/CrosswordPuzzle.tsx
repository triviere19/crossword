"use client"

import styles from "./CrosswordPuzzle.module.css";
import { CSSProperties, useRef } from "react";
import Cell from "../../common/Cell/Cell";
import { useCrossword } from "@/components/Crossword/common/CrosswordContext/CrosswordContext";

export interface CrosswordPuzzleProps{
    className?: string,
    style?: CSSProperties,
}

export default function CrosswordPuzzle(props: CrosswordPuzzleProps){

    const { layout,
        play,
        focusedWordId,
        updateCellGuess,
        handleCellBlur,
        handleCellFocus,
        handleCellClick,
        handleCellKeyDown 
    } = useCrossword();

    // ======================================================================================
    // AUTO SIZE GRID SIZE

    const puzzle = useRef<HTMLDivElement|null>(null);

    const numRows = (layout?.grid) ? (
        layout.grid.length
    ) : 1;

    const numCols = (layout?.grid && layout.grid.length) ? (
        layout.grid[0].length
    ) : 1;

    const cellSize = (puzzle.current) ? (
        Math.min(puzzle.current.offsetWidth / numCols, puzzle.current.offsetHeight / numRows)
    ) : 1;

    return (
        <div 
            className={`${styles.container} ${props.className}`} 
            style={{...props.style}}
            ref={puzzle}
        >
            <div 
                className={styles.grid}
                style={{
                    gridTemplateColumns: `repeat(${numCols}, ${cellSize}px)`,
                    gridTemplateRows: `repeat(${numRows}, ${cellSize}px)`,
                    width: `${cellSize * numCols}px`,
                    height: `${cellSize * numRows}px`,
                }}
            >
                { layout && layout.grid.map((row, y) => (
                    row && row.map((cell, x) => {

                        // find number if applicable 
                        let number = undefined;
                        layout?.words.filter(word => word.id == cell.acrossWordId || word.id == cell.downWordId).forEach((word) => {
                            if(x == word.startx && y == word.starty){
                                number = word.position;
                            }
                        });

                        return (
                            <Cell 
                                key={`${x}-${y}`} 
                                id={`cell(${x},${y})`}
                                size={cellSize}
                                value={play?.[y]?.[x]?.guess || " "}
                                state={play?.[y]?.[x]?.state || "inactive"}
                                answer={cell.answer}
                                onChange={(value)=>updateCellGuess(x, y, value)}
                                highlighted={Boolean(focusedWordId) && (cell.acrossWordId == focusedWordId || cell.downWordId == focusedWordId)}
                                onFocus={()=>handleCellFocus(cell)}
                                onClick={(e)=>handleCellClick(e, cell)}
                                onBlur={handleCellBlur}
                                onKeyDown={handleCellKeyDown}
                                number={number}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
}