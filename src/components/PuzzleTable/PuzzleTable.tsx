import { CrosswordEntry } from "@/models/Crossword";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";

export interface PuzzleTableProps {
    puzzles: CrosswordEntry[],
}

export default function PuzzleTable(props: PuzzleTableProps){


    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                { props.puzzles.map((puzzle, i) => (
                    <TableRow key={i}>
                        <TableCell>{puzzle.id}</TableCell>
                        <TableCell>{String(puzzle.dateCreated)}</TableCell>
                        <TableCell>...</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}