import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import {
    Board,
    Player,
    GameResult,
    isValidMove,
    nextState,
    getWinner,
} from '@repo/game-core';

const app = express();
const port = process.env.PORT || 3000;

interface GameSession {
    id: string;
    board: Board;
    currentPlayer: Player;
    result?: GameResult;
}

const sessions = new Map<string, GameSession>();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Hello from Backend!' });
});

// Get all active sessions
app.get('/sessions', (req, res) => {
    const activeSessions = Array.from(sessions.values());
    res.json(activeSessions);
});

// Create a new game session
app.post('/sessions', (req, res) => {
    const sessionId = uuidv4();
    const session: GameSession = {
        id: sessionId,
        board: Array(9).fill(null),
        currentPlayer: 'X',
    };
    sessions.set(sessionId, session);
    res.status(201).json(session);
});

// Get session by ID
app.get('/sessions/:id', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }
    res.json(session);
});

// Make a move in the game
app.post('/sessions/:id/move', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    const { index } = req.body;
    if (typeof index !== 'number' || index < 0 || index > 8) {
        return res.status(400).json({ error: 'Invalid move index' });
    }

    if (session.result) {
        return res.status(400).json({ error: 'Game is already finished' });
    }

    if (!isValidMove(session.board, index)) {
        return res.status(400).json({ error: 'Invalid move' });
    }

    const newBoard = nextState(session.board, index, session.currentPlayer);
    if (!newBoard) {
        return res.status(400).json({ error: 'Invalid move' });
    }

    session.board = newBoard;
    const result = getWinner(newBoard);

    if (result.winner || result.isDraw) {
        session.result = result;
    } else {
        session.currentPlayer = session.currentPlayer === 'X' ? 'O' : 'X';
    }

    sessions.set(session.id, session);
    res.json(session);
});

// Reset a game session
app.post('/sessions/:id/reset', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    session.board = Array(9).fill(null);
    session.currentPlayer = 'X';
    delete session.result;

    sessions.set(session.id, session);
    res.json(session);
});

// Delete a game session
app.delete('/sessions/:id', (req, res) => {
    const session = sessions.get(req.params.id);
    if (!session) {
        return res.status(404).json({ error: 'Session not found' });
    }

    sessions.delete(req.params.id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
