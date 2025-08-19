# Tic-tac-toe

A cute and fun, little Tic-tac-toe game with real-time multiplayer support.

Includes a **Model Context Protocol (MCP) Server** that lets AI agents (like Copilot, Cursor) connect and play the game using natural language.

## 🎮 Game Features

-   Real-time multiplayer gameplay with Socket.IO
-   Multiple game sessions support
-   Supports custom symbols (hearts, stars, cat, bunnies, etc.)
-   Interactive sound effects
-   Visual winning indicators

## Demo

https://github.com/user-attachments/assets/6fa9844c-0727-4eab-a1ef-6503e54016a4

## Project Structure

This is a Turborepo project:

```
├── apps/
│   ├── backend/           # Game server & WebSocket handler
│   ├── frontend/          # React frontend application
│   └── mcp-server/        # MCP server
├── packages/
│   ├── game-core/         # Shared game logic and types
│   └── typescript-config/ # Shared TS configurations
```

## MCP Integration Details

### Available Tools

1. **Create Game Session** – start a new game, AI joins as Player X
2. **Wait for Opponent** – monitor until a human player joins
3. **Make Move** – play a move (0–8), validate, update state
4. **Get Current State** – board state, current turn, win/draw status
5. **End Game Session** – clean up after game ends or disconnect

### AI Interaction Flow

```
AI Agent → MCP Server (3001) → Game Server (3000) → Frontend (5173)
```

1. Agent initiates a game via MCP
2. Real players connect via frontend
3. WebSocket keeps both sides in sync
4. AI receives board updates and responds with moves

## Getting Started

1. Clone and install:

```bash
git clone https://github.com/nirajbagdi/tic-tac-toe.git
cd tic-tac-toe
pnpm install
```

2. Start all services:

```bash
pnpm dev
```

Or start individual services:

```bash
pnpm --filter mcp-server dev   # MCP server
pnpm --filter backend dev      # Game server
pnpm --filter frontend dev     # Web interface
```

Access points:

-   Web UI: http://localhost:5173
-   Game Server: http://localhost:3000
-   MCP Server: http://localhost:3001

**Note: This MCP server runs on http instead of stdio**

## MCP Configuration

In any IDE or editor that supports AI Agents and MCP (e.g., VS Code, Cursor, Windsurf), locate the MCP configuration file and add the Tic-tac-toe MCP server as shown below.

This project includes a VS Code MCP configuration in `.vscode/mcp.json`

```json
{
    "servers": {
        "tic-tac-toe": {
            "type": "http",
            "url": "http://localhost:3001/mcp"
        }
    }
}
```

Start the MCP server and make sure the application endpoints are running.

### Testing the MCP Integration

1. Start all services (as shown in Getting Started)
2. In your MCP-compatible agent interface:

```
Ask: "Let's play Tic-tac-toe!"
Response: Will create a new session which you can join, make moves, and play against the AI opponent.
```
