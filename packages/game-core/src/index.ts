export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

export type GameResult = {
    winner?: Player;
    line?: number[];
    isDraw: boolean;
};

export interface GameSession {
    id: string;
    board: Board;
    currentPlayer: Player;
    result?: GameResult;
    players: {
        X?: string;
        O?: string;
    };
}

export type Coordinates = {
    row: number;
    col: number;
};

// All possible winning lines as index triplets
export const winningLines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
] as const;

/**
 * Convert a board index (0-8) to row/column coordinates
 */
export function indexToCoordinates(index: number): Coordinates {
    return {
        row: Math.floor(index / 3),
        col: index % 3,
    };
}

/**
 * Convert row/column coordinates to a board index (0-8)
 */
export function coordinatesToIndex({ row, col }: Coordinates): number {
    return row * 3 + col;
}

/**
 * Check if a move is valid on the given board
 */
export function isValidMove(board: Board, index: number): boolean {
    return index >= 0 && index < 9 && board[index] === null;
}

/**
 * Returns next board state after a move without modifying original
 */
export function nextState(
    board: Board,
    index: number,
    player: Player
): Board | null {
    if (!isValidMove(board, index)) {
        return null;
    }

    const newBoard = [...board];
    newBoard[index] = player;
    return newBoard;
}

/**
 * Check for a winner or draw
 */
export function getWinner(board: Board): GameResult {
    // Check for winner
    for (const line of winningLines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return {
                winner: board[a],
                line: [...line],
                isDraw: false,
            };
        }
    }

    // Check for draw
    const isDraw = board.every((cell) => cell !== null);
    return {
        isDraw,
    };
}
