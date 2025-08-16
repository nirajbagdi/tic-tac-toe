import { useState, useEffect } from 'react';
import { useSound } from '../contexts/SoundContext';
import { Board, Player } from '@repo/game-core';
import { gameApi } from '../api/gameApi';

interface UseGameLogicProps {
    existingSessionId?: string;
}

export const useGameLogic = ({ existingSessionId }: UseGameLogicProps = {}) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const { playPop, playWin, playDraw } = useSound();

    useEffect(() => {
        const initGame = async () => {
            try {
                const session = existingSessionId
                    ? await gameApi.getSession(existingSessionId)
                    : await gameApi.createSession();

                setSessionId(session.id);
                setBoard(session.board);
                setCurrentPlayer(session.currentPlayer);

                if (session.result) {
                    setWinner(session.result.winner ?? null);
                    setWinningLine(session.result.line ?? null);
                }
            } catch (error) {
                console.error('Failed to initialize game:', error);
            }
        };

        initGame();
    }, [existingSessionId]);

    const handleClick = async (index: number) => {
        if (!sessionId || winner) return;

        try {
            const session = await gameApi.makeMove(sessionId, index);
            setBoard(session.board);
            setCurrentPlayer(session.currentPlayer);
            playPop();

            if (session.result) {
                setWinner(session.result.winner ?? null);
                setWinningLine(session.result.line ?? null);

                if (session.result.isDraw) playDraw();
                else if (session.result.winner) playWin();
            }
        } catch (error) {
            console.error('Failed to make move:', error);
        }
    };

    const resetGame = async () => {
        if (!sessionId) return;

        try {
            const session = await gameApi.resetSession(sessionId);
            setBoard(session.board);
            setCurrentPlayer(session.currentPlayer);
            setWinner(null);
            setWinningLine(null);
        } catch (error) {
            console.error('Failed to reset game:', error);
        }
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
