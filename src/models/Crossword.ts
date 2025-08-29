export interface CrosswordCell {
    x: number;          // column index
    y: number;          // row index
    letter: string;     // the letter at this cell
    across?: number;    // index of the word in the 'words' array if across
    down?: number;      // index of the word in the 'words' array if down
  }
  
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