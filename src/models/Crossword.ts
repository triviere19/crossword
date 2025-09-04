// ===================================================================================
// FROM crossword-layout-generator

export type ClgCrosswordGrid = string[][]; // 2D array of letters
export interface ClgCrosswordWordLayout {
  clue: string,
  answer: string,
  startx: number,                 // starting column
  starty: number,                 // starting row
  orientation: "across" | "down",
  position: number,
}

export interface ClgCrosswordLayout {
  table: ClgCrosswordGrid,           // 2D letter array
  result: ClgCrosswordWordLayout[],  // positioned words
}

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