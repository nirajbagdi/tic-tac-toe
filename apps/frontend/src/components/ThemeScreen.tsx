import React from 'react';
import { Theme } from '@/types';

interface ThemeScreenProps {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    onBack: () => void;
}

export const ThemeScreen: React.FC<ThemeScreenProps> = ({
    theme,
    onThemeChange,
    onBack,
}) => {
    const themes: { id: Theme; label: string; preview: string }[] = [
        { id: 'default', label: 'Classic', preview: 'X O' },
        { id: 'hearts', label: 'Hearts', preview: '❤️ 💖' },
        { id: 'stars', label: 'Stars', preview: '⭐ ✨' },
        { id: 'cats', label: 'Cats', preview: '🐱 😺' },
        { id: 'bunnies', label: 'Bunnies', preview: '🐰 🐇' },
        { id: 'sweets', label: 'Sweets', preview: '🧁 🍩' },
        { id: 'flowers', label: 'Flowers', preview: '🌸 🌺' },
        { id: 'weather', label: 'Weather', preview: '☀️ ⭐' },
        { id: 'fruits', label: 'Fruits', preview: '🍎 🍊' },
    ];

    return (
        <>
            <h2 className="screen-title">Choose Theme</h2>
            <div className="theme-grid">
                {themes.map(({ id, label, preview }) => (
                    <button
                        key={id}
                        className={`theme-card ${theme === id ? 'active' : ''}`}
                        onClick={() => onThemeChange(id)}
                    >
                        <div className="theme-preview">{preview}</div>
                        <span>{label}</span>
                    </button>
                ))}
            </div>
            <button className="secondary-button" onClick={onBack}>
                Back
            </button>
        </>
    );
};
