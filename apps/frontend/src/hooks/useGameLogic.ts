import { useState } from 'react';
import { useSound } from '../contexts/SoundContext';
import { Board, Player, getWinner as checkWinner, nextState } from '@repo/game-core';

export const useGameLogic = () => {
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const { playPop, playWin, playDraw } = useSound();

    const handleClick = (index: number) => {
        if (winner) return;

        const newBoard = nextState(board, index, currentPlayer);
        if (!newBoard) return; // Invalid move

        setBoard(newBoard);
        playPop();

        const result = checkWinner(newBoard);
        if (result.winner || result.isDraw) {
            setWinner(result.winner ?? null);
            setWinningLine(result.line ?? null);

            if (result.isDraw) playDraw();
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
