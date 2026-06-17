import { db } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET() {
    try {
        const puzzles = await db.getPuzzles();
        console.log(`${puzzles.length} puzzles found!`)
        return NextResponse.json(puzzles);
    } catch (e) {
        console.error(`Could not get puzzles!\n${e}`);
        return NextResponse.json({ error: `Failed to fetch puzzles`}, { status: 500 });
    }
}

// export async function POST(req: NextRequest) {
//     try {
//         const body = await req.json();
//         const puzzle = await db.addPuzzle(body);
//         return NextResponse.json(puzzle, { status: 201 });
//     } catch (e) {
//         console.error(e);
//         return NextResponse.json({ error: `Failed to add puzzle` }, { status: 500 });
//     }
// }