

"use client"

import { CrosswordCell, CrosswordCellPlay, CrosswordCellState, CrosswordLayout, CrosswordWordLayout } from "@/models/Crossword";
import { KeyboardEvent, useEffect, useRef, useState, MouseEvent, createContext, ReactNode, useContext } from "react";

export interface CrosswordContextType {
    layout: CrosswordLayout|undefined,
    play: CrosswordCellPlay[][],
    timer: number,
    solved: boolean,
    focusedCell: CrosswordCell | undefined,
    focusedWordId: string | undefined,
    focusDirection: "across" | "down",
    reset: () => void,
    setLayout: (set: CrosswordLayout|undefined) => void,
    checkPuzzle: () => void,
    updateCellGuess: (x: number, y:number, value: string) => void,
    handleCellBlur: () => void,
    handleCellFocus: (cell: CrosswordCell) => void,
    handleCellClick: (event: MouseEvent, cell: CrosswordCell) => void,
    handleCellKeyDown: (event: KeyboardEvent) => void,
}

export function CrosswordProvider({children}:{children: ReactNode}){
    
    // ======================================================================================
    // INITIALIZING PLAY

    const [layout, setLayout] = useState<CrosswordLayout|undefined>(undefined);
    const [play, setPlay] = useState<CrosswordCellPlay[][]>([]);
    const initialized = useRef(false);

    useEffect(() => {
        if(!initialized.current && layout){
            console.debug("initialized!")
            setPlay(layout.grid.map((row) => row.map((cell) => ({
                guess: "",
                state: cell.answer == "-" ? "inactive" : "normal",
            }))));
            initialized.current = true;
        }
    }, [layout]);

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

    const [timer, setTimer] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>|null>(null);

    useEffect(() => {
        if(layout && !timeoutRef.current){
            let initTime = new Date();
            const tick = () => {
                const seconds = Math.round((new Date().getTime() - initTime.getTime())/1000);
                setTimer(seconds);
                timeoutRef.current = setTimeout(tick, 1000);
            }
            timeoutRef.current = setTimeout(tick, 1000);
        }
    }, [layout]);

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


    const focusCellWithCoords = (x: number | undefined, y: number | undefined) => {
        if(layout && focusedCell && x != undefined && y != undefined){
            const rows = layout.grid.length;
            const cols = layout.grid[0].length;
            if(x < 0 || x >= cols){
                return false;
            }
            if(y < 0 || y >= rows){
                return false;
            }
            if(layout.grid[y][x].answer == "-"){
                return false;
            }
            const cell = document.getElementById(`cell(${x},${y})`)
            cell?.focus();
            return Boolean(cell);
        }
    }

    const sortedAcrossWords = layout?.words.filter(w => (w.orientation == "across")).sort((a, b) => a.position - b.position) || [];
    const sortedDownWords = layout?.words.filter(w => (w.orientation == "down")).sort((a, b) => a.position - b.position) || [];

    const focusWordByCoords = (x: number, y: number) => {
        
    }

    
    const focusNextWord = () => {
        if(layout){
            if(focusedCell){
                const searchSortedWordList = (direction: "across" | "down", startWordIndex: number) => {
                    const sortedWordList = direction == "across" ? sortedAcrossWords : sortedDownWords;
                    for(let i = startWordIndex; i < sortedWordList.length; i++){
                        const word = sortedWordList[i];
                        for(let j = 0; j < word.answer.length; j++){
                            const cell = word.orientation == "across" ? layout.grid[word.starty][word.startx+j] : layout.grid[word.starty+j][word.startx];
                            if(!play[cell.x][cell.y].guess){
                                setFocusDirection(direction);
                                focusCellWithCoords(cell.x, cell.y);
                                return true; 
                            }
                        }
                    }
                    return false;
                }

                const firstWordIndex = focusDirection == "across" ? (sortedAcrossWords.findIndex(w => w.id == focusedWordId)) : (sortedDownWords.findIndex(w => w.id == focusedWordId));
                if(!searchSortedWordList(focusDirection, firstWordIndex+1)){
                    console.debug("not here");
                    if(!searchSortedWordList(focusDirection == "across" ? "down" : "across", 0)){
                        console.debug("not there");
                        if(focusDirection == "across"){
                            if(focusedCell.y < sortedAcrossWords.length - 1){
                                focusCellWithCoords(sortedAcrossWords[focusedCell.y+1].startx, sortedAcrossWords[focusedCell.y+1].starty)
                            } else {
                                focusCellWithCoords(sortedDownWords[0].startx, sortedDownWords[0].starty);
                            }
                        } else {
                            if(focusedCell.x < sortedDownWords.length - 1){
                                focusCellWithCoords(sortedDownWords[focusedCell.x+1].startx, sortedDownWords[focusedCell.x+1].starty)
                            } else {
                                focusCellWithCoords(sortedAcrossWords[0].startx, sortedAcrossWords[0].starty);
                            }
                        }
                    }
                }

            }
        }
    }


    const handleCellKeyDown = (event: KeyboardEvent) => {
        console.debug(event.key);
        let next: BasicCell | undefined = undefined;
        if(event.key == "Tab" || event.key == "Enter"){
            /** @todo */
            event.preventDefault(); 
            if(focusedCell){
                focusNextWord();
            } else {
                focusWordByCoords(0, 0);
            }
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
        //     setFocusedCell(layout?.grid[next.y][next.x]);
        // }
    }
    
    // debug
    // useEffect(() => { console.log(focusedWordId) }, [focusedWordId]);
    // ======================================================================================
    
    const [solved, setSolved] = useState(false);

    useEffect(() => {
        if(layout && play.length && play[0].length && initialized.current){
            for(let y = 0; y < play.length; y++){
                const row = play[y];
                for(let x = 0; x < row.length; x++){
                    const cell = row[x];
                    if(layout.grid[y][x].answer == "-"){
                        continue;
                    } else if(cell.guess == layout.grid[y][x].answer.toUpperCase()){
                        continue;
                    } else {
                        return;
                    }
                }
            }
            setSolved(true);
        }
    }, [layout, play, initialized.current]);

    useEffect(() => {
        if(solved && timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [solved]);

    // ======================================================================================

    // reset function
    const reset = () => {

    }

    // ======================================================================================
    
    return (
        <CrosswordContext.Provider value={{
            layout,
            play,
            timer,
            solved,
            focusedCell,
            focusedWordId,
            focusDirection,
            reset,
            checkPuzzle: handleCheckPuzzle,
            setLayout,
            updateCellGuess,
            handleCellBlur,
            handleCellFocus,
            handleCellClick,
            handleCellKeyDown
        }}>
            {children}
        </CrosswordContext.Provider>
    );
}

export function useCrossword(){ 
    return useContext(CrosswordContext);
}

export const defaultCrosswordContextType: CrosswordContextType = {
    layout: undefined,
    play: [],
    timer: 0,
    solved: false,
    focusedCell: undefined,
    focusedWordId: undefined,
    focusDirection: "across",
    reset: () => {},
    setLayout: () => {},
    checkPuzzle: () => {},
    updateCellGuess: (x: number, y:number, value: string) => {},
    handleCellBlur: () => {},
    handleCellFocus: (cell: CrosswordCell) => {},
    handleCellClick: (event: MouseEvent, cell: CrosswordCell) => {},
    handleCellKeyDown: (event: KeyboardEvent) => {},
}

const CrosswordContext = createContext<CrosswordContextType>(defaultCrosswordContextType);
