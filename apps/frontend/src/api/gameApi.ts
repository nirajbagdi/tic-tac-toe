import { Board, Player, GameResult } from '@repo/game-core';

const API_URL = 'http://localhost:3000';

interface GameSession {
    id: string;
    board: Board;
    currentPlayer: Player;
    result?: GameResult;
}

export const gameApi = {
    createSession: async (): Promise<GameSession> => {
        const response = await fetch(`${API_URL}/sessions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to create game session');
        }

        return response.json();
    },

    getSession: async (id: string): Promise<GameSession> => {
        const response = await fetch(`${API_URL}/sessions/${id}`);

        if (!response.ok) {
            throw new Error('Failed to get game session');
        }

        return response.json();
    },

    makeMove: async (sessionId: string, index: number): Promise<GameSession> => {
        const response = await fetch(`${API_URL}/sessions/${sessionId}/move`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ index }),
        });

        if (!response.ok) {
            throw new Error('Failed to make move');
        }

        return response.json();
    },

    resetSession: async (sessionId: string): Promise<GameSession> => {
        const response = await fetch(`${API_URL}/sessions/${sessionId}/reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to reset game');
        }

        return response.json();
    },

    deleteSession: async (sessionId: string): Promise<void> => {
        const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete game session');
        }
    },
};
