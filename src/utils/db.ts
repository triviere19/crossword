import { CrosswordEntry, CrosswordLayout } from '@/models/Crossword';
import postgres from 'postgres';
 
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

type PuzzleRow = {
    id: number
    date_created: Date
    puzzle: CrosswordLayout
}

const rowToEntry = (row: PuzzleRow): CrosswordEntry & { id: number } => ({
    id: row.id,
    dateCreated: row.date_created,
    puzzle: row.puzzle,
})

const getPuzzles = async () => {
    const data = await sql<PuzzleRow[]>`SELECT * FROM puzzles`;
    return data.map(rowToEntry);
}

const getTodaysPuzzles = async () => {
    const data = await sql<PuzzleRow[]>`
        SELECT * FROM puzzles
        WHERE date_created >= (CURRENT_DATE AT TIME ZONE 'America/New_York')
        AND date_created < (CURRENT_DATE AT TIME ZONE 'America/New_York') + INTERVAL '1 day'
    `;
    return data.map(rowToEntry);
}

const addPuzzle = async (crossword: CrosswordLayout) => {
    const data = await sql<PuzzleRow[]>`
        INSERT INTO puzzles (date_created, puzzle)
        VALUES (now(), ${sql.json(crossword as any)})
        RETURNING *
    `;
    return rowToEntry(data[0]);
}

export const db = {
    getPuzzles,
    getTodaysPuzzles,
    addPuzzle
}