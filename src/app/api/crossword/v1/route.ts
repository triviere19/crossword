import { NextResponse } from "next/server";
import { createRequire } from "module";
import { readFileSync } from "fs";
import { ClgCrosswordLayout, CrosswordCell, CrosswordLayout } from "@/models/Crossword";
import { v4 } from "uuid";
import { printGrid } from "@/utils/print";
const require = createRequire(import.meta.url);
const clg = require("crossword-layout-generator");

export interface GetCrosswordResult {
    layout: CrosswordLayout,
    error?: string,
}

// Handle GET requests
export async function GET(request: Request) {

    try {

        /** @todo take parameters for generating the clues */
    
        /** @todo implement chat gpt api to generate list of clues given a prompt */
        /** for now, grab pregenerated list from json file */
        const file = readFileSync("public/clues/hockey-clues-1.json", "utf-8");
        const data = JSON.parse(file);
        
        if(data.clues){
    
            /** Use crossword-layout-generator to generate puzzle given list of clues */
            const layout: ClgCrosswordLayout = clg.generateLayout(data.clues);

            /** Generate ids for each word */
            const words = layout.result.map((word) => ({
                ...word,
                startx: word.startx-1, // clg interface starts index at 1 smh
                starty: word.starty-1, // clg interface starts index at 1 smh
                id: v4(),
            }));

            /** Add wordIds to cells */
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

            const grid = layout.table.map((row, y) => row.map((cell, x): CrosswordCell => ({
                acrossWordId: findWordId(x, y, "across"),
                downWordId: findWordId(x, y, "down"),
                x: x,
                y: y,
                answer: cell,
            })));

            /** Build translated interface */
            const translated: CrosswordLayout = {
                grid: grid,
                words: words,
            }
            console.debug("Crossword generated successfully :)");

            printGrid(translated.grid);
    
            return NextResponse.json({layout: translated});
    
        }
    
    
        return NextResponse.json({ message: "Hello from Next.js App Router API!" });

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


