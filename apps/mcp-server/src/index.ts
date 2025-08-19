import express from 'express';
import { randomUUID } from 'crypto';
import fetch from 'node-fetch';

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { GameSession } from '@repo/game-core';

const app = express();
app.use(express.json());

const port = process.env.PORT || 3001;
const BACKEND_URL = 'http://localhost:3000';

const server = new McpServer({
    name: 'tic-tac-toe-server',
    version: '1.0.0',
});

server.registerTool(
    'createGameSession',

    {
        title: 'Create a new Tic-Tac-Toe Game Session',
        description: 'Creates a new game session and returns immediately',
    },

    async function () {
        try {
            const response = await fetch(`${BACKEND_URL}/sessions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!response.ok) throw new Error('Failed to create game session');

            const jsonResponse = await response.json();
            const session = jsonResponse as GameSession;

            return {
                content: [{ type: 'text', text: `Session created: ${session.id}` }],
            };
        } catch (error) {
            if (error instanceof Error)
                throw new Error(`Failed to create game session: ${error.message}`);
            throw new Error('Failed to create game session: Unknown error');
        }
    }
);

const transports: {
    [sessionId: string]: StreamableHTTPServerTransport;
} = {};

app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
    } else if (!sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
            sessionIdGenerator: () => randomUUID(),
            onsessioninitialized: (sessionId) => {
                transports[sessionId] = transport;
            },
        });

        transport.onclose = () => {
            if (transport.sessionId) delete transports[transport.sessionId];
        };

        await server.connect(transport);
    } else {
        res.status(400).json({
            jsonrpc: '2.0',
            error: {
                code: -32000,
                message: 'Bad Request: No valid session ID provided',
            },
            id: null,
        });
        return;
    }

    await transport.handleRequest(req, res, req.body);
});

const handleSessionRequest = async (req: express.Request, res: express.Response) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !transports[sessionId]) {
        res.status(400).send('Invalid or missing session ID');
        return;
    }

    const transport = transports[sessionId];
    await transport.handleRequest(req, res);
};

app.get('/mcp', handleSessionRequest);
app.delete('/mcp', handleSessionRequest);

app.listen(port, () => console.log(`MCP server running on port ${port}`));
