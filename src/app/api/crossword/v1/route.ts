import { NextResponse } from "next/server";
import { createRequire } from "module";
import { readFileSync } from "fs";
import { CrosswordLayout } from "@/models/Crossword";
const require = createRequire(import.meta.url);
const clg = require("crossword-layout-generator");

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
            const layout: CrosswordLayout = clg.generateLayout(data.clues);
            console.debug("Crossword generated successfully :)");
            console.debug(layout);
    
            return NextResponse.json({layout});
    
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
