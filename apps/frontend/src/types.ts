import { Player, Board } from '@repo/game-core';

export type { Player, Board };

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
