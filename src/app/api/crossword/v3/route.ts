import { NextResponse } from "next/server";
import { CrosswordLayout, defaultCrosswordGeneratorOptions } from "@/models/Crossword";
import { printCrossword, printGrid } from "@/utils/print";
import { composeRandomGrid, crosswordFromGrid } from "@/utils/grid";
import { generateClue } from "@/utils/clues";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/auth";

export interface GetCrosswordResult {
    layout: CrosswordLayout,
    error?: string,
}

// Handle GET requests
export async function GET(request: Request) {

    const session = await getServerSession(authOptions);
  
    if (!session) {
        return NextResponse.json({ status: 401, error: 'Unauthorized. Please sign in.' });
    }

    try {

        /** take parameters for generating the puzzle, clues */
        const blanks = request.headers.get('blanks') != null  ? parseInt(request.headers.get('blanks')!) : undefined;
        const rows = request.headers.get('rows') != null  ? parseInt(request.headers.get('rows')!) : undefined;
        const cols = request.headers.get('cols') != null  ? parseInt(request.headers.get('cols')!) : undefined;
        const difficulty = request.headers.get('difficulty') || defaultCrosswordGeneratorOptions.difficulty;
        
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
        
        console.log("Took " + (new Date().getTime() - startTime.getTime()) + "ms to generate\n");

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


