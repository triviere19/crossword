import { CrosswordCell, CrosswordLayout, CrosswordWordLayout } from "@/models/Crossword";
import { getWordList } from "./words";
import { v4 } from "uuid";

/** 
 * Uses crossword-composer to generate a simple 2D grid crossword puzzle, given some options
 * @param options
 *  @param rows number of rows
 *  @param cols number of cols
 *  @param blanks number of blank spaces
 *  @param wordList list of words to choose from
 */
export const composeRandomGrid = async (options?: {
    rows?: number, 
    cols?: number, 
    blanks?: number, 
    wordList?: string
}) => {

    const rows = options?.rows || 5;
    const cols = options?.cols || 5;
    const blanks = options?.blanks || 2;
    const wordList = options?.wordList || "mit";

    const nSlots = rows * cols;
    let slotIndecies: number[] = [];

    for(let i = 0; i < nSlots; i++){
        slotIndecies.push(i);
    }

    // generate list of random blank slot indecies
    let blankSlotIndecies: number[] = [];
    while(blankSlotIndecies.length < blanks){
        const index = Math.floor(Math.random() * slotIndecies.length);
        const slotIndex = slotIndecies.splice(index, 1)[0];
        blankSlotIndecies.push(slotIndex);
    }

    console.debug(`\nblankSlotIndecies:`);
    console.debug(blankSlotIndecies);

    // generate indexed grid
    let indexedGrid: number[][] = [];
    let index = 0;
    let slotNum = 0;
    for(let y = 0; y < rows; y++){
        indexedGrid.push([]);
        for(let x = 0; x < cols; x++){
            if(blankSlotIndecies.includes(index)){
                indexedGrid[y].push(-1);
            } else {
                indexedGrid[y].push(slotNum);
                slotNum++;
            }
            index++;
        }
    }

    console.debug(`\indexedGrid:`);
    indexedGrid.forEach(row => console.debug(row));

    let gridSpec: number[][] = [];
    let spec = [];

    // find all across words
    for(let y = 0; y < rows; y++){
        for(let x = 0; x < cols; x++){
            if(indexedGrid[y][x] > -1){
                spec.push(indexedGrid[y][x]);
            } else {
                if(spec.length > 2){
                    gridSpec.push(spec);
                }
                spec = [];
            }
        }
        if(spec.length > 2){
            gridSpec.push(spec);
        }
        spec = [];
    }

    // find all down words
    for(let x = 0; x < cols; x++){
        for(let y = 0; y < rows; y++){
            if(indexedGrid[y][x] > -1){
                spec.push(indexedGrid[y][x]);
            } else {
                if(spec.length > 2){
                    gridSpec.push(spec);
                }
                spec = [];
            }
        }
        if(spec.length > 2){
            gridSpec.push(spec);
        }
        spec = [];
    }

    console.debug(`\ngridSpec:`);
    gridSpec.forEach(row => console.debug(row));

    // compose crossword
    /** 
     * @note does not work with turbo pack, since it is .node file and is based 
     * on machine platform, needs to be imported at run time
     */
    /** @todo figure out how to turn tubopack back on, need to figure out config */
    const { Solver } = await import("@crossword-composer-ts/core");
    const solver = new Solver(await getWordList(wordList));
    const result = solver.solve(gridSpec);

    if(result){

        // format and return result
        index = 0;
        let grid: string[][] = [];
        for(let y = 0; y < rows; y++){
            grid.push([]);
            for(let x = 0; x < cols; x++){
                if(indexedGrid[y][x] > -1){
                    grid[y].push(result[index]);
                    index++;
                } else {
                    grid[y].push(' ');
                }
            }
        }
    
        return grid;

    } else {
        // throw if could not create crossword
        // unfortunately, not all can be solved with the given inputs
        throw("Unable to compose crossword :(");
    }

}

// ======================================================================================================

export const crosswordFromGrid = (simple_grid: string[][]): CrosswordLayout => {
    const cols = simple_grid.length;
    const rows = simple_grid[0].length;

    let words: CrosswordWordLayout[] = [];

    // --------------------------------------------------------------------------------------------------
    // Identify words

    let positionIndex = 1;
    const saveWord = (word: string, orientation: "across" | "down", x: number, y: number) => {
        if(word.length > 2){
            if(!words.find(w => w.answer == word)){
                const startx = orientation == "across" ? x - word.length+1 : x;
                const starty = orientation == "down" ? y - word.length+1 : y;

                let position = positionIndex;
                if(orientation == "down"){
                    const sharedPosition = words.find(w => w.orientation == "across" && w.startx == startx && w.starty == starty)?.position;
                    if(sharedPosition) position = sharedPosition;
                    else positionIndex++;
                } else {
                    positionIndex++;
                }

                words.push({
                    id: v4(),
                    clue: word,
                    answer: word,
                    startx: startx,
                    starty: starty,
                    orientation: orientation,
                    position: position,
                });
            }
        }
    }

    // Identify across words
    for(let y = 0; y < rows; y++){
        let word = "";
        for(let x = 0; x < cols; x++){
            if(simple_grid[y][x] == " "){
                saveWord(word, "across", x-1, y);
                word = "";
            } else {
                word += simple_grid[y][x];
            }
        }
        saveWord(word, "across", cols-1, y);
    }

    // Identify down words
    for(let x = 0; x < cols; x++){
        let word = "";
        for(let y = 0; y < rows; y++){
            if(simple_grid[y][x] == " "){
                saveWord(word, "down", x, y-1);
                word = "";
            } else {
                word += simple_grid[y][x];
            }
        }
        saveWord(word, "down", x, rows-1);
    }

    // --------------------------------------------------------------------------------------------------
    // Identify cells

    const findWordId = (x: number, y: number, direction: "across" | "down") => {
        for(let i = 0; i < words.length; i++){
            const word = words[i];
            if(direction == "across" && word.orientation == "across"){
                if((y == word.starty) && (x >= word.startx) && (x < word.startx + word.answer.length)){
                    return word.id;
                } else {
                    continue;
                }
            } else if (direction =="down" && word.orientation ==  "down") {
                if((x == word.startx) && (y >= word.starty) && (y < word.starty + word.answer.length)){
                    return word.id;
                } else {
                    continue;
                }
            } else {
                continue;
            }
        }
        return undefined;
    }

    const grid = simple_grid.map((row, y) => row.map((cell, x): CrosswordCell => ({
        acrossWordId: findWordId(x, y, "across"),
        downWordId: findWordId(x, y, "down"),
        x: x,
        y: y,
        answer: cell == " " ? "-" : cell,
    })));

    // --------------------------------------------------------------------------------------------------

    return { grid, words }
}