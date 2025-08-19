import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { GameSession, isValidMove, nextState, getWinner } from '@repo/game-core';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const port = process.env.PORT || 3000;

const sessions = new Map<string, GameSession>();

app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinGame', async (sessionId: string) => {
        const session = sessions.get(sessionId);
        if (!session) {
            socket.emit('error', 'Session not found');
            return;
        }

        // Assign player to X or O
        if (!session.players.X) {
            session.players.X = socket.id;
        } else if (!session.players.O) {
            session.players.O = socket.id;
        } else {
            socket.emit('error', 'Game is full');
            return;
        }

        socket.join(sessionId);
        socket.emit('gameJoined', {
            ...session,
            player: session.players.X === socket.id ? 'X' : 'O',
        });
        io.to(sessionId).emit('gameUpdated', session);
    });

    socket.on(
        'makeMove',
        async ({ sessionId, index }: { sessionId: string; index: number }) => {
            const session = sessions.get(sessionId);
            if (!session) {
                socket.emit('error', 'Session not found');
                return;
            }

            // Check if it's the player's turn
            const playerSymbol = session.players.X === socket.id ? 'X' : 'O';
            if (playerSymbol !== session.currentPlayer) {
                socket.emit('error', 'Not your turn');
                return;
            }

            if (session.result) {
                socket.emit('error', 'Game is already finished');
                return;
            }

            if (!isValidMove(session.board, index)) {
                socket.emit('error', 'Invalid move');
                return;
            }

            const newBoard = nextState(session.board, index, session.currentPlayer);
            if (!newBoard) {
                socket.emit('error', 'Invalid move');
                return;
            }

            session.board = newBoard;
            const result = getWinner(newBoard);

            if (result.winner || result.isDraw) {
                session.result = result;
            } else {
                session.currentPlayer = session.currentPlayer === 'X' ? 'O' : 'X';
            }

            sessions.set(session.id, session);
            io.to(sessionId).emit('gameUpdated', session);
        }
    );

    socket.on('resetGame', (sessionId: string) => {
        const session = sessions.get(sessionId);
        if (!session) {
            socket.emit('error', 'Session not found');
            return;
        }

        session.board = Array(9).fill(null);
        session.currentPlayer = 'X';
        delete session.result;

        sessions.set(session.id, session);
        io.to(sessionId).emit('gameUpdated', session);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        // Clean up player assignments when they disconnect
        for (const [sessionId, session] of sessions.entries()) {
            if (session.players.X === socket.id || session.players.O === socket.id) {
                if (session.players.X === socket.id) {
                    session.players.X = undefined;
                }
                if (session.players.O === socket.id) {
                    session.players.O = undefined;
                }
                io.to(sessionId).emit('playerDisconnected', socket.id);
            }
        }
    });
});

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
        players: {},
    };
    sessions.set(sessionId, session);
    res.status(201).json(session);
});

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
