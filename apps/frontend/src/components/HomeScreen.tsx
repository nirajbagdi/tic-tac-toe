import React, { useState } from 'react';
import { SessionList } from './SessionList';
import { gameApi } from '../api/gameApi';

interface HomeScreenProps {
    onJoinSession: (sessionId: string) => void;
    onThemes: () => void;
    onSettings: () => void;
    onAbout: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
    onJoinSession,
    onThemes,
    onSettings,
    onAbout,
}) => {
    const [showSessionList, setShowSessionList] = useState(false);

    const handleCreateGame = async () => {
        try {
            const session = await gameApi.createSession();
            onJoinSession(session.id);
        } catch (error) {
            console.error('Failed to create game session:', error);
        }
    };

    const handleJoinGame = (sessionId: string) => {
        onJoinSession(sessionId);
    };

    if (showSessionList) {
        return (
            <SessionList
                onJoinSession={handleJoinGame}
                onBack={() => setShowSessionList(false)}
            />
        );
    }

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
                <div className="play-buttons">
                    <button className="play-button" onClick={handleCreateGame}>
                        Create Game
                    </button>
                    <button
                        className="play-button"
                        onClick={() => setShowSessionList(true)}
                    >
                        Join Game
                    </button>
                </div>
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
