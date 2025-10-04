"use client"

import styles from "./CrosswordPuzzle.module.css";
import { CrosswordCell, CrosswordCellPlay, CrosswordCellState, CrosswordLayout } from "@/models/Crossword";
import { KeyboardEvent, useEffect, useRef, useState, MouseEvent } from "react";
import Cell from "../../Crossword/Cell/Cell";
import Word from "../../Crossword/Word/Word";
import Logo from "../../Logo/Logo";
import TimerIcon from '@mui/icons-material/Timer';
import CheckButton from "../../CheckButton/CheckButton";
import PuzzleSolvedModal from "../../Crossword/PuzzleSolvedModal/PuzzleSolvedModal";
import { formatTimer } from "@/utils/time";

export interface CrosswordPuzzleProps{
    layout: CrosswordLayout|undefined,
}

export default function CrosswordPuzzle(props: CrosswordPuzzleProps){
    
    // ======================================================================================
    // INITIALIZING PLAY

    const [play, setPlay] = useState<CrosswordCellPlay[][]>([]);
    const initialized = useRef(false);

    useEffect(() => {
        if(!initialized.current && props.layout){
            console.debug("initialized!")
            setPlay(props.layout.grid.map((row) => row.map((cell) => ({
                guess: "",
                state: cell.answer == "-" ? "inactive" : "normal",
            }))));
            initialized.current = true;
        }
    }, [props.layout]);

    // ======================================================================================
    // AUTO SIZE GRID SIZE

    const puzzle = useRef<HTMLDivElement|null>(null);

    const numRows = (props.layout?.grid) ? (
        props.layout.grid.length
    ) : 1;

    const numCols = (props.layout?.grid && props.layout.grid.length) ? (
        props.layout.grid[0].length
    ) : 1;

    const cellSize = (puzzle.current) ? (
        Math.min(puzzle.current.offsetWidth / numCols, puzzle.current.offsetHeight / numRows)
    ) : 1;

    // ======================================================================================
    // HEADER FUNCTIONS

    const handleCheckPuzzle = () => {
        setPlay(play.map((row, y) => (row.map((cell, x) => {
            let state: CrosswordCellState = "normal";
            if(props.layout?.grid[y][x].answer == "-"){
                state = "inactive";
            } else if(cell.guess == props.layout?.grid[y][x].answer.toUpperCase()){
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

    const [timer, setTimer] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>|null>(null);

    useEffect(() => {
        if(props.layout && !timeoutRef.current){
            let initTime = new Date();
            const tick = () => {
                const seconds = Math.round((new Date().getTime() - initTime.getTime())/1000);
                setTimer(seconds);
                timeoutRef.current = setTimeout(tick, 1000);
            }
            timeoutRef.current = setTimeout(tick, 1000);
        }
    }, [props.layout]);

    // ======================================================================================
    // STATE MANAGEMENT

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
            setFocusedWordId((props.layout?.words.find(word => (
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
    const handleCellClick = (event: MouseEvent, cell: CrosswordCell) => {
        event.preventDefault();
        if(focusedCell?.x == cell.x && focusedCell.y == cell.y){
            if(focusDirection == "across" && cell.downWordId){
                setFocusDirection("down");
            } else if (focusDirection == "down" && cell.acrossWordId){
                setFocusDirection("across");
            }
            setFocusedCell(cell);
        } else {
            focusCellWithCoords(cell.x, cell.y);
        }
    }

    interface BasicCell {
        direction: "across" | "down",
        x: number,
        y: number,
    }
    const findNextCellToFocus = (direction: "across" | "down", ogX: number, ogY: number): BasicCell | undefined => {
        
        const lookNext = (direction: "across" | "down", x: number, y: number): BasicCell | undefined => {
            /** @warning still possibility of infinite search if all cells are filled */
            if(props.layout){
                if(direction == "across"){
                    let newY = 0;
                    if(x+1 >= props.layout.grid[y].length){
                        newY = (y+1) % props.layout.grid.length;
                    } else {
                        newY = y % props.layout?.grid[y].length;
                    }
                    const newX = (x+1) % props.layout?.grid[y].length;
                    if(props.layout.grid[newY][newX].answer == "-" || play[newY][newX].guess){
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
                    if(y+1 >= props.layout.grid.length){
                        newX = (x+1) % props.layout.grid[y].length;
                    } else {
                        newX = x % props.layout?.grid[y].length;
                    }
                    const newY = (y+1) % props.layout?.grid.length;
                    if(props.layout.grid[newY][newX].answer == "-" || play[newY][newX].guess){
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


    const focusCellWithCoords = (x: number | undefined, y: number | undefined) => {
        if(props.layout && focusedCell && x != undefined && y != undefined){
            const rows = props.layout.grid.length;
            const cols = props.layout.grid[0].length;
            if(x < 0 || x >= cols){
                return false;
            }
            if(y < 0 || y >= rows){
                return false;
            }
            if(props.layout.grid[y][x].answer == "-"){
                return false;
            }
            const cell = document.getElementById(`cell(${x},${y})`)
            cell?.focus();
            return Boolean(cell);
        }
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
            event.preventDefault();
            if(focusedCell){
                updateCellGuess(focusedCell.x, focusedCell.y, "");
                if(focusDirection == "across"){
                    focusCellWithCoords(focusedCell.x-1, focusedCell.y);
                } else if (focusDirection == "down"){
                    focusCellWithCoords(focusedCell.x, focusedCell.y-1);
                }
            }
            return;
        } else if (event.key == "ArrowUp" || event.key == "ArrowDown") {
            event.preventDefault();
            if(focusDirection == "across" && focusedCell?.downWordId){
                setFocusDirection("down");
                return;
            } else if (focusedCell){
                if(event.key == "ArrowUp"){
                    focusCellWithCoords(focusedCell.x, focusedCell.y-1);
                    return;
                } else if (event.key == "ArrowDown") {
                    focusCellWithCoords(focusedCell.x, focusedCell.y+1);
                    return;
                }
            }
        } else if (event.key == "ArrowLeft" || event.key == "ArrowRight") {
            event.preventDefault();
            if(focusDirection == "down" && focusedCell?.acrossWordId){
                setFocusDirection("across");
                return;
            } else if (focusedCell){
                if(event.key == "ArrowLeft"){
                    focusCellWithCoords(focusedCell.x-1, focusedCell.y);
                    return;
                } else if (event.key == "ArrowRight") {
                    focusCellWithCoords(focusedCell.x+1, focusedCell.y);
                    return;
                }
            }
        } else if (/^[a-zA-Z]$/.test(event.key)){
            event.preventDefault();
            if(focusedCell){
                updateCellGuess(focusedCell.x, focusedCell.y, event.key.toUpperCase());
                if(focusDirection == "across"){
                    focusCellWithCoords(focusedCell.x+1, focusedCell.y);
                } else if (focusDirection == "down"){
                    focusCellWithCoords(focusedCell.x, focusedCell.y+1);
                }
            }
            return;
        }
        // if(next){
        //     setFocusDirection(next.direction);
        //     setFocusedCell(props.layout?.grid[next.y][next.x]);
        // }
    }
    
    // debug
    // useEffect(() => { console.log(focusedWordId) }, [focusedWordId]);
    // ======================================================================================
    
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        if(props.layout && play.length && play[0].length && initialized.current){
            for(let y = 0; y < play.length; y++){
                const row = play[y];
                for(let x = 0; x < row.length; x++){
                    const cell = row[x];
                    if(props.layout.grid[y][x].answer == "-"){
                        continue;
                    } else if(cell.guess == props.layout.grid[y][x].answer.toUpperCase()){
                        continue;
                    } else {
                        return;
                    }
                }
            }
            setSolved(true);
        }
    }, [props.layout, play, initialized.current]);

    useEffect(() => {
        if(solved && timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [solved]);

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
                    <div className={styles.timer}><TimerIcon/>{formatTimer(timer)}</div>
                    <CheckButton className={styles.button} onClick={handleCheckPuzzle}/>
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
                        { props.layout && props.layout.grid.map((row, y) => (
                            row && row.map((cell, x) => {

                                // find number if applicable 
                                let number = undefined;
                                props.layout?.words.filter(word => word.id == cell.acrossWordId || word.id == cell.downWordId).forEach((word) => {
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

                {/* =========================================================================== */}
                {/* CLUES */}
            
                <div className={styles.clues}>
                    <div className={styles.clues}>
                        <h4 className={styles.clues_title}>{`ACROSS`}</h4>
                        {/* <div className={styles.divider}/> */}
                        { props.layout?.words.filter(clue => clue.orientation == "across").map((clue, i) => (
                            <Word number={clue.position} clue={clue.clue} highlighted={clue.id == focusedWordId} key={i}/>
                        ))}
                    </div>
                    <div className={styles.divider}/>
                    <div className={styles.clues}>
                        <h4 className={styles.clues_title}>{`DOWN`}</h4>
                        {/* <div className={styles.divider}/> */}
                        { props.layout?.words.filter(clue => clue.orientation == "down").map((clue, i) => (
                            <Word number={clue.position} clue={clue.clue} highlighted={clue.id == focusedWordId} key={i}/>
                        ))}
                    </div>
                </div>

                {/* =========================================================================== */}

                <PuzzleSolvedModal solved={solved} time={timer}/>

                {/* =========================================================================== */}

            </div>

        </>
    );
}