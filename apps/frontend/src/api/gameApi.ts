import { GameSession } from '../types';

const API_URL = 'http://localhost:3000';

export const gameApi = {
    getAllSessions: async (): Promise<GameSession[]> => {
        const response = await fetch(`${API_URL}/sessions`);

        if (!response.ok) {
            throw new Error('Failed to get game sessions');
        }

        return response.json();
    },

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
};
