import { useState } from 'react';
import { useSound } from '../contexts/SoundContext';
import { BoardState, Player } from '../types';

export const useGameLogic = () => {
    const [board, setBoard] = useState<BoardState>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | 'draw' | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const { playPop, playWin, playDraw } = useSound();

    const checkWinner = (
        squares: BoardState
    ): { winner: Player | 'draw' | null; line: number[] | null } => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8], // rows
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8], // columns
            [0, 4, 8],
            [2, 4, 6], // diagonals
        ];

        for (const line of lines) {
            const [a, b, c] = line;
            const valueA = squares[a as number];
            const valueB = squares[b as number];
            const valueC = squares[c as number];
            if (valueA && valueA === valueB && valueA === valueC) {
                return { winner: valueA as Player, line };
            }
        }

        if (squares.every((square) => square !== null)) {
            return { winner: 'draw', line: null };
        }

        return { winner: null, line: null };
    };

    const handleClick = (index: number) => {
        if (board[index] || winner) return;

        const newBoard = [...board];
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        playPop();

        const { winner: gameWinner, line } = checkWinner(newBoard);

        if (gameWinner) {
            setWinner(gameWinner);
            setWinningLine(line);

            if (gameWinner === 'draw') playDraw();
            else playWin();
        } else {
            setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setCurrentPlayer('X');
        setWinner(null);
        setWinningLine(null);
    };

    return {
        board,
        currentPlayer,
        winner,
        winningLine,
        handleClick,
        resetGame,
    };
};
