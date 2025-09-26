import { NextResponse } from "next/server";
import { CrosswordCell, CrosswordLayout } from "@/models/Crossword";
import { v4 } from "uuid";
import { printCrossword, printGrid } from "@/utils/print";
import puzzle from "@/data/clues/composer-test-1.json";
import { composeRandomGrid, crosswordFromGrid } from "@/utils/grid";

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
        console.log("Took " + (new Date().getTime() - startTime.getTime()) + "ms to generate\n");

        /** Convert to grid to Crossword object */
        
        
        const crossword = crosswordFromGrid(composedGrid);

        printCrossword(crossword.grid);

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


