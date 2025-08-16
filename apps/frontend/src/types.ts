import { Player, Board, GameResult } from '@repo/game-core';

export type { Player, Board };

export interface GameSession {
    id: string;
    board: Board;
    currentPlayer: Player;
    result?: GameResult;
    players: {
        X?: string;
        O?: string;
    };
}

export type Theme =
    | 'default'
    | 'hearts'
    | 'stars'
    | 'cats'
    | 'bunnies'
    | 'sweets'
    | 'flowers'
    | 'weather'
    | 'fruits';
