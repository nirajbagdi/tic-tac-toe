export type Player = 'X' | 'O';

export type BoardState = (Player | null)[];

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

export type Screen = 'home' | 'game' | 'themes' | 'about' | 'settings';
