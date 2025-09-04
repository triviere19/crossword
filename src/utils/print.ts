import { CrosswordCell } from "@/models/Crossword";

export const printGrid = (grid: CrosswordCell[][]) => {
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