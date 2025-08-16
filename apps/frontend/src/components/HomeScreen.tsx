import React from 'react';

interface HomeScreenProps {
    onPlay: () => void;
    onThemes: () => void;
    onSettings: () => void;
    onAbout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
    onPlay,
    onThemes,
    onSettings,
    onAbout,
}) => {
    return (
        <>
            <div className="home-mascot">
                <div className="mascot-peek">(｡◕‿◕｡)</div>
            </div>

            <h1 className="game-logo">
                <span className="logo-text">Tic</span>
                <span className="logo-text">Tac</span>
                <span className="logo-text">Toe</span>
            </h1>

            <div className="home-buttons">
                <button className="play-button" onClick={onPlay}>
                    Play Game
                </button>
                <div className="secondary-buttons">
                    <button className="secondary-button" onClick={onThemes}>
                        Themes
                    </button>
                    <button className="secondary-button" onClick={onSettings}>
                        Settings
                    </button>
                    <button className="secondary-button" onClick={onAbout}>
                        About
                    </button>
                </div>
            </div>
        </>
    );
};
