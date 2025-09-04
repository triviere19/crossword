declare module "crossword-layout-generator" {

    export type CrosswordGrid = string[][]; // 2D array of letters
    export interface CrosswordWordLayout {
        clue: string,
        answer: string,
        startx: number,                 // starting column
        starty: number,                 // starting row
        orientation: "across" | "down",
        position: number,
    }

    export interface CrosswordLayout {
        table: CrosswordGrid,           // 2D letter array
        result: CrosswordWordLayout[],  // positioned words
    }

    export function generateLayout(words: string[]): CrosswordLayout;
}