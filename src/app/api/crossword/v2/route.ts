import { NextResponse } from "next/server";
import { CrosswordLayout } from "@/models/Crossword";
import { printCrossword, printGrid } from "@/utils/print";
import { composeRandomGrid, crosswordFromGrid } from "@/utils/grid";
import { formatTimeString } from "@/utils/time";

export interface GetCrosswordResult {
    layout: CrosswordLayout,
    error?: string,
}

// Handle GET requests
export async function GET(request: Request) {

    try {

        /** @todo take parameters for generating the puzzle, clues */
        
        /** compose crossword grid */
        const startTime = new Date();
        const composedGrid = await composeRandomGrid({rows: 5, cols: 5, blanks: 2});
        if(composedGrid){
            console.log("Randomly Composed Crossword:");
            printGrid(composedGrid);
        }
        console.log("Took " + formatTimeString(new Date().getTime() - startTime.getTime()) + " to generate\n");

        /** Convert grid to Crossword object */
        const crossword = crosswordFromGrid(composedGrid);
        printCrossword(crossword.grid);

        /** @todo Generate clues with AI */

        return NextResponse.json({layout: crossword});
    
    } catch (e) {

        console.error(e);
        return NextResponse.json({ error: "We failed to cross your words :("}, {status: 500});

    }

}

// Handle POST requests
export async function POST(request: Request) {
    const body = await request.json();
    return NextResponse.json({ youSent: body });
}


