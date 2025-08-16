import { useState, useEffect } from 'react';
import { useSound } from '../contexts/SoundContext';
import { Board, Player } from '@repo/game-core';
import { gameApi } from '../api/gameApi';
import { useSocket } from './useSocket';

interface UseGameLogicProps {
    existingSessionId?: string;
}

export const useGameLogic = ({ existingSessionId }: UseGameLogicProps = {}) => {
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [board, setBoard] = useState<Board>(Array(9).fill(null));
    const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
    const [winner, setWinner] = useState<Player | null>(null);
    const [winningLine, setWinningLine] = useState<number[] | null>(null);
    const [isYourTurn, setIsYourTurn] = useState<boolean>(false);
    const { playPop, playWin, playDraw } = useSound();

    const socket = useSocket(sessionId);

    useEffect(() => {
        const initGame = async () => {
            try {
                const session = existingSessionId
                    ? await gameApi.getSession(existingSessionId)
                    : await gameApi.createSession();

                setSessionId(session.id);
            } catch (error) {
                console.error('Failed to initialize game:', error);
            }
        };

        initGame();
    }, [existingSessionId]);

    useEffect(() => {
        if (!socket) return;

        socket.onGameJoined((data) => {
            setBoard(data.board);
            setCurrentPlayer(data.currentPlayer);
            setIsYourTurn(data.currentPlayer === data.player);

            if (data.result) {
                setWinner(data.result.winner ?? null);
                setWinningLine(data.result.line ?? null);
            }
        });

        socket.onGameUpdated((session) => {
            setBoard(session.board);
            setCurrentPlayer(session.currentPlayer);
            setIsYourTurn(session.currentPlayer === socket.player);

            if (session.result) {
                setWinner(session.result.winner ?? null);
                setWinningLine(session.result.line ?? null);

                if (session.result.isDraw) {
                    playDraw();
                } else if (session.result.winner) {
                    playWin();
                }
            } else {
                playPop();
            }
        });

        socket.onPlayerDisconnected(() => {
            // Handle opponent disconnection if needed
            console.log('Opponent disconnected');
        });
    }, [socket, playPop, playWin, playDraw]);

    const handleClick = async (index: number) => {
        if (!sessionId || winner || !isYourTurn) return;
        socket.makeMove(index);
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
        isYourTurn,
    };
};
