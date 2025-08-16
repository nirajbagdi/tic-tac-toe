import { Player, Theme } from '../types';

export const getSymbol = (value: Player | null, theme: Theme): string => {
    if (!value) return '';

    switch (theme) {
        case 'hearts':
            return value === 'X' ? '❤️' : '💖';
        case 'stars':
            return value === 'X' ? '⭐' : '✨';
        case 'cats':
            return value === 'X' ? '🐱' : '😺';
        case 'bunnies':
            return value === 'X' ? '🐰' : '🐇';
        case 'sweets':
            return value === 'X' ? '🧁' : '🍩';
        case 'flowers':
            return value === 'X' ? '🌸' : '🌺';
        case 'weather':
            return value === 'X' ? '☀️' : '⭐';
        case 'fruits':
            return value === 'X' ? '🍎' : '🍊';
        default:
            return value;
    }
};
