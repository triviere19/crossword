"use client"

import styles from "./CrosswordPuzzle.module.css";
import { CrosswordCell, CrosswordCellPlay, CrosswordCellState, CrosswordLayout, CrosswordWordLayout } from "@/models/Crossword";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import Cell from "../Crossword/Cell/Cell";
import { GetCrosswordResult } from "@/app/api/crossword/v1/route";
import Word from "../Crossword/Word/Word";
import Logo from "../Logo/Logo";


export default function CrosswordPuzzle(){
    
    // ======================================================================================
    // FETCH PUZZLE

    const [layout, setLayout] = useState<CrosswordLayout|undefined>(undefined);
    const [play, setPlay] = useState<CrosswordCellPlay[][]>([]);

    useEffect(() => {
        fetch("/api/crossword/v1").then(async (res) => {
            const result: GetCrosswordResult = await res.json();
            if(res.ok){
                if(result.layout){
                    setLayout(result.layout);
                    setPlay(result.layout.grid.map((row) => row.map((cell) => ({
                        guess: "",
                        state: cell.answer == "-" ? "inactive" : "normal",
                    }))));
                } else {
                    console.error(`Error: could not set state. Crossword layout no good.`);
                }
            } else {
                console.error(res.status, result.error);
            }
        });
    }, []);

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

    // ======================================================================================
    // HEADER FUNCTIONS

    const handleCheckPuzzle = () => {
        setPlay(play.map((row, y) => (row.map((cell, x) => {
            let state: CrosswordCellState = "normal";
            if(layout?.grid[y][x].answer == "-"){
                state = "inactive";
            } else if(cell.guess == layout?.grid[y][x].answer.toUpperCase()){
                state = "correct";
            } else if (cell.guess == ""){
                state = "normal";
            } else {
                state = "incorrect";
            }
            return ({
                guess: cell.guess,
                state: state,
            });
        }))));
    }

    // ======================================================================================
    // STATE MANAGEMENT

    const updateCellState = (x: number, y:number, state: CrosswordCellState) => {
        setPlay(play.map((row, pY) => (row.map((cell, pX) => (
            (x == pX && y == pY) ? 
            ({
                guess: cell.guess,
                state: state,
            }) 
            : 
            (cell)
        )))));
    }

    const updateCellGuess = (x: number, y:number, value: string) => {
        setPlay(play.map((row, pY) => (row.map((cell, pX) => (
            (x == pX && y == pY) ? 
            ({
                guess: value,
                state: "normal",
            }) 
            : 
            (cell)
        )))));

        /** @todo check that puzzle is complete */
    }

    // ======================================================================================
    // CELL FOCUS
    const [focusedCell, setFocusedCell] = useState<CrosswordCell|undefined>(undefined);
    const [focusedWordId, setFocusedWordId] = useState<string|undefined>(undefined);
    const [focusDirection, setFocusDirection] = useState<"across"|"down">("across");

    useEffect(() => {
        if(focusedCell){
            setFocusedWordId((layout?.words.find(word => (
                focusDirection == "across" ? 
                (focusedCell.acrossWordId == word.id) : 
                (focusedCell.downWordId == word.id)
            ))?.id));
        } else {
            setFocusedWordId(undefined);
        }
    }, [focusedCell, focusDirection]);


    /** @note order of triggers: onBlur, onFocus, onClick */

    const handleCellBlur = () => {
        setFocusedCell(undefined);
    }

    const handleCellFocus = (cell: CrosswordCell) => {
        if(focusDirection == "across" && cell.acrossWordId){
            setFocusDirection("across");
        } else if(focusDirection == "down" && cell.downWordId) {
            setFocusDirection("down");
        } else if(cell.acrossWordId){
            setFocusDirection("across");
        } else if(cell.downWordId) {
            setFocusDirection("down");
        }
        setFocusedCell(cell);
    }
    
    /** @note need to use onClick in case cell is already focused */
    const handleCellClick = (cell: CrosswordCell) => {
        // if(focusedCell?.x == cell.x && focusedCell.y == cell.y){
        //     if(focusDirection == "across" && cell.downWordId){
        //         setFocusDirection("down");
        //     } else if (focusDirection == "down" && cell.acrossWordId){
        //         setFocusDirection("across");
        //     }
        //     setFocusedCell(cell);
        // }
    }

    interface BasicCell {
        direction: "across" | "down",
        x: number,
        y: number,
    }
    const findNextCellToFocus = (direction: "across" | "down", ogX: number, ogY: number): BasicCell | undefined => {
        
        const lookNext = (direction: "across" | "down", x: number, y: number): BasicCell | undefined => {
            /** @warning still possibility of infinite search if all cells are filled */
            if(layout){
                if(direction == "across"){
                    let newY = 0;
                    if(x+1 >= layout.grid[y].length){
                        newY = (y+1) % layout.grid.length;
                    } else {
                        newY = y % layout?.grid[y].length;
                    }
                    const newX = (x+1) % layout?.grid[y].length;
                    if(layout.grid[newY][newX].answer == "-" || play[newY][newX].guess){
                        return findNextCellToFocus("across", newX, newY);
                    } else {
                        return ({
                            direction: "across",
                            x: newX,
                            y: newY,
                        });
                    }
                } else if(direction == "down"){
                    let newX = 0;
                    if(y+1 >= layout.grid.length){
                        newX = (x+1) % layout.grid[y].length;
                    } else {
                        newX = x % layout?.grid[y].length;
                    }
                    const newY = (y+1) % layout?.grid.length;
                    if(layout.grid[newY][newX].answer == "-" || play[newY][newX].guess){
                        return findNextCellToFocus("down", newX, newY);
                    } else {
                        return ({
                            direction: "down",
                            x: newX,
                            y: newY,
                        });
                    }
                }
            }
            return undefined;
        }

        return lookNext(direction, ogX, ogY);
    }

    const handleCellKeyDown = (event: KeyboardEvent) => {
        console.debug(event.key);
        let next: BasicCell | undefined = undefined;
        if(event.key == "Tab" || event.key == "Enter"){
            /** @todo */
            // event.preventDefault(); 
            // if(focusedCell){
            //     next = findNextCellToFocus(focusDirection, focusedCell.x, focusedCell.y);
            // }
            return;
        } else if (event.key == "Backspace") {
            /** @todo */
            return;
        } else if (event.key == "ArrowUp" || event.key == "ArrowDown") {
            event.preventDefault();
            if(focusDirection == "across"){
                setFocusDirection("down");
                return;
            }
        } else if (event.key == "ArrowLeft" || event.key == "ArrowRight") {
            event.preventDefault();
            if(focusDirection == "down"){
                setFocusDirection("across");
                return;
            }
        } else {
            /** @todo */
            // if(focusedCell){
            //     next = findNextCellToFocus(focusDirection, focusedCell.x, focusedCell.y);
            // }
            return;
        }
        // if(next){
        //     setFocusDirection(next.direction);
        //     setFocusedCell(layout?.grid[next.y][next.x]);
        // }
    }

    // debug
    // useEffect(() => { console.log(focusedWordId) }, [focusedWordId]);

    // ======================================================================================

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
                    <button className={styles.button} onClick={handleCheckPuzzle}>CHECK</button>
                </div>
            </div>

            {/* =========================================================================== */}
            {/* PUZZLE */}

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
                        { layout && layout.grid.map((row, y) => (
                            row.map((cell, x) => {
                                return (
                                    <Cell 
                                        key={`${x}-${y}`} 
                                        size={cellSize}
                                        // value={cell}
                                        value={play[y][x].guess}
                                        state={play[y][x].state}
                                        answer={cell.answer}
                                        onChange={(value)=>updateCellGuess(x, y, value)}
                                        highlighted={Boolean(focusedWordId) && (cell.acrossWordId == focusedWordId || cell.downWordId == focusedWordId)}
                                        onFocus={()=>handleCellFocus(cell)}
                                        onClick={()=>handleCellClick(cell)}
                                        onBlur={handleCellBlur}
                                        onKeyDown={handleCellKeyDown}
                                    />
                                );
                            })
                        ))}
                    </div>
                </div>

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

            </div>

        </>
    );
}