import { describe, it, expect } from 'vitest';
import {
    Board,
    Player,
    getWinner,
    nextState,
    isValidMove,
    indexToCoordinates,
    coordinatesToIndex,
} from './index';

describe('Game Core', () => {
    describe('Board Coordinates', () => {
        it('converts between index and coordinates correctly', () => {
            // Test all positions
            for (let i = 0; i < 9; i++) {
                const coords = indexToCoordinates(i);
                const index = coordinatesToIndex(coords);
                expect(index).toBe(i);
            }

            // Test specific cases
            expect(indexToCoordinates(0)).toEqual({ row: 0, col: 0 });
            expect(indexToCoordinates(4)).toEqual({ row: 1, col: 1 });
            expect(indexToCoordinates(8)).toEqual({ row: 2, col: 2 });

            expect(coordinatesToIndex({ row: 0, col: 0 })).toBe(0);
            expect(coordinatesToIndex({ row: 1, col: 1 })).toBe(4);
            expect(coordinatesToIndex({ row: 2, col: 2 })).toBe(8);
        });
    });

    describe('Move Validation', () => {
        it('validates moves correctly', () => {
            const emptyBoard: Board = Array(9).fill(null);
            const boardWithMoves: Board = [
                'X',
                null,
                'O',
                null,
                'X',
                null,
                'O',
                null,
                null,
            ];

            // Valid moves
            expect(isValidMove(emptyBoard, 0)).toBe(true);
            expect(isValidMove(boardWithMoves, 1)).toBe(true);
            expect(isValidMove(boardWithMoves, 8)).toBe(true);

            // Invalid moves: occupied cell
            expect(isValidMove(boardWithMoves, 0)).toBe(false);
            expect(isValidMove(boardWithMoves, 4)).toBe(false);

            // Invalid moves: out of bounds
            expect(isValidMove(emptyBoard, -1)).toBe(false);
            expect(isValidMove(emptyBoard, 9)).toBe(false);
        });
    });

    describe('Next State', () => {
        it('returns new board state for valid moves', () => {
            const board: Board = Array(9).fill(null);
            const player: Player = 'X';

            const newBoard = nextState(board, 4, player);
            expect(newBoard).toEqual([
                null,
                null,
                null,
                null,
                'X',
                null,
                null,
                null,
                null,
            ]);

            // Original board should be unchanged
            expect(board).toEqual(Array(9).fill(null));
        });

        it('returns null for invalid moves', () => {
            const board: Board = ['X', null, 'O', null, 'X', null, 'O', null, null];

            // Try to play in occupied cell
            expect(nextState(board, 0, 'O')).toBeNull();

            // Try to play out of bounds
            expect(nextState(board, 9, 'O')).toBeNull();
        });
    });

    describe('Winner Detection', () => {
        it('detects horizontal wins', () => {
            const board: Board = [
                'X',
                'X',
                'X', // Top row win
                'O',
                'O',
                null,
                null,
                null,
                null,
            ];

            expect(getWinner(board)).toEqual({
                winner: 'X',
                line: [0, 1, 2],
                isDraw: false,
            });
        });

        it('detects vertical wins', () => {
            const board: Board = ['O', 'X', null, 'O', 'X', null, 'O', null, null];

            expect(getWinner(board)).toEqual({
                winner: 'O',
                line: [0, 3, 6],
                isDraw: false,
            });
        });

        it('detects diagonal wins', () => {
            const board: Board = ['X', 'O', null, 'O', 'X', null, null, null, 'X'];

            expect(getWinner(board)).toEqual({
                winner: 'X',
                line: [0, 4, 8],
                isDraw: false,
            });
        });

        it('detects draws', () => {
            const board: Board = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];

            expect(getWinner(board)).toEqual({
                isDraw: true,
            });
        });

        it('returns no result for ongoing game', () => {
            const board: Board = ['X', null, 'O', null, 'X', null, 'O', null, null];

            expect(getWinner(board)).toEqual({
                isDraw: false,
            });
        });
    });
});
