import { Player, Board, GameSession } from '@repo/game-core';

export type { Player, Board, GameSession };

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
