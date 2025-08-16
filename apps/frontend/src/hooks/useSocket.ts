import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Board, Player, GameResult } from '@repo/game-core';

const SOCKET_URL = 'http://localhost:3000';

interface GameSession {
    id: string;
    board: Board;
    currentPlayer: Player;
    result?: GameResult;
    players: {
        X?: string;
        O?: string;
    };
}

interface GameJoinedData extends GameSession {
    player: Player;
}

export const useSocket = (sessionId: string | null) => {
    const socketRef = useRef<Socket | null>(null);
    const playerRef = useRef<Player | null>(null);

    const initSocket = () => {
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on('connect', () => {
            console.log('Connected to server');
        });

        socketRef.current.on('error', (error: string) => {
            console.error('Socket error:', error);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    };

    useEffect(() => {
        const cleanup = initSocket();
        return cleanup;
    }, []);

    useEffect(() => {
        if (sessionId && socketRef.current) {
            socketRef.current.emit('joinGame', sessionId);
        }
    }, [sessionId]);

    const makeMove = (index: number) => {
        if (socketRef.current && sessionId) {
            socketRef.current.emit('makeMove', { sessionId, index });
        }
    };

    const onGameJoined = (callback: (data: GameJoinedData) => void) => {
        if (socketRef.current) {
            socketRef.current.on('gameJoined', (data: GameJoinedData) => {
                playerRef.current = data.player;
                callback(data);
            });
        }
    };

    const onGameUpdated = (callback: (session: GameSession) => void) => {
        if (socketRef.current) {
            socketRef.current.on('gameUpdated', callback);
        }
    };

    const onPlayerDisconnected = (callback: (playerId: string) => void) => {
        if (socketRef.current) {
            socketRef.current.on('playerDisconnected', callback);
        }
    };

    return {
        makeMove,
        onGameJoined,
        onGameUpdated,
        onPlayerDisconnected,
        player: playerRef.current,
    };
};
