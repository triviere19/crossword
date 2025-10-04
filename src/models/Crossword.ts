import { CrosswordWordLayout as ClgCrosswordWordLayout } from "crossword-layout-generator";

// ===================================================================================
// My Crossword Interface
export interface CrosswordCell {
  acrossWordId: string | undefined,
  downWordId: string | undefined,
  x: number,
  y: number,
  answer: string,
}

export type CrosswordGrid = CrosswordCell[][]; // 2D array of letters
export interface CrosswordWordLayout extends ClgCrosswordWordLayout {
  id: string,
}

export interface CrosswordLayout {
  grid: CrosswordGrid,           // 2D letter array
  words: CrosswordWordLayout[],  // positioned words
}

// ===================================================================================
// Crossword Game Play Interface

export interface CrosswordCellPlay {
  guess: string,
  state: CrosswordCellState,
}

export type CrosswordCellState = "normal" | "incorrect" | "correct" | "inactive";

// ===================================================================================
// Crossword Generator

export interface CrosswordGeneratorOptions {
  blanks: number,
  rows: number,
  cols: number,
  difficulty: string,
}

export const defaultCrosswordGeneratorOptions: CrosswordGeneratorOptions = {
  blanks: 2,
  rows: 5,
  cols: 5,
  difficulty: "5th grader",
}