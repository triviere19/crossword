import { CrosswordCell } from "@/models/Crossword";

/** Nicely formats a crossword puzzle for CLI and prints, given a 2D array of CrosswordCells */
export const printCrossword = (grid: CrosswordCell[][]) => {
    for(let y = 0; y < grid.length; y++){
        let row = "|";
        let borderRow = "+";
        for(let x = 0; x < grid[y].length; x++){
            const letter = grid[y][x].answer.toUpperCase();
            row += (letter == "-" ? (`   |`) : (` ${letter} |`));
            borderRow += "---+";
        }
        if(y == 0) console.log(borderRow);
        console.log(row);
        console.log(borderRow);
    }
}

/** Nicely formats a crossword puzzle for CLI and prints, given a simple 2D string array */
export const printGrid = (grid: string[][]) => {
    for(let y = 0; y < grid.length; y++){
        let row = "|";
        let borderRow = "+";
        for(let x = 0; x < grid[y].length; x++){
            const letter = grid[y][x].toUpperCase();
            row += (letter == "-" ? (`   |`) : (` ${letter} |`));
            borderRow += "---+";
        }
        if(y == 0) console.log(borderRow);
        console.log(row);
        console.log(borderRow);
    }
}