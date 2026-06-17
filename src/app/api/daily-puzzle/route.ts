import { CrosswordLayout } from "@/models/Crossword";
import { generateClue } from "@/utils/clues";
import { db } from "@/utils/db";
import { composeRandomGrid, crosswordFromGrid } from "@/utils/grid";
import { printCrossword, printGrid } from "@/utils/print";
import { formatTimeString } from "@/utils/time";
import { NextResponse } from "next/server";

export interface GetDailyPuzzleResult {
    layout: CrosswordLayout,
    error?: string,
}

export async function GET() {
    try {
        const puzzles = await db.getTodaysPuzzles();
        console.debug(`${puzzles.length} puzzles found for today: ${new Date().toDateString()}`);

        // generate puzzle if there isnt one already
        if(puzzles.length < 1){

            console.log(`Generating new puzzle for ${new Date().toDateString()}`)
            
            /** take parameters for generating the puzzle, clues */
            const blanks = 2; // @todo randomize?
            const rows = 5; // @todo randomize?
            const cols = 5; // @todo randomize?
            const difficulty = "college graduate";
            
            /** compose crossword grid */
            const startTime = new Date();
            const composedGrid = await composeRandomGrid({rows, cols, blanks});
            if(composedGrid){
                console.log("Randomly Composed Crossword:");
                printGrid(composedGrid);
            }
            
            /** Convert grid to Crossword object */
            const crossword = crosswordFromGrid(composedGrid);
            printCrossword(crossword.grid);
            
            /** Generate clues with AI */
            for(let i = 0; i < crossword.words.length; i++){
                const word = crossword.words[i];
                const aiClue = await generateClue(word.answer, difficulty);
                word.clue = aiClue;
            }
            
            console.log("Took " + formatTimeString(new Date().getTime() - startTime.getTime()) + " to generate\n");

            await db.addPuzzle(crossword);

            return NextResponse.json({ layout: crossword });

        } else {

            return NextResponse.json({ layout: puzzles[0].puzzle });

        }

    } catch (e) {

        console.error(`Could not get puzzle!\n${e}`);
        return NextResponse.json({ error: `Failed to fetch puzzles`}, { status: 500 });

    }
}