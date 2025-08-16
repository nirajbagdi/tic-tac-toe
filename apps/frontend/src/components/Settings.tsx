import React from 'react';
import { useSound } from '../contexts/SoundContext';

interface SettingsProps {
    onBack: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ onBack }) => {
    const { isSoundEnabled, isMusicEnabled, toggleSound, toggleMusic } = useSound();

    return (
        <div className="settings-screen">
            <h2 className="screen-title">Settings</h2>

            <div className="settings-content">
                <div className="setting-item">
                    <span>Sound Effects</span>
                    <button
                        className={`toggle-button ${isSoundEnabled ? 'active' : ''}`}
                        onClick={toggleSound}
                    >
                        {isSoundEnabled ? 'On' : 'Off'}
                    </button>
                </div>

                <div className="setting-item">
                    <span>Background Music</span>
                    <button
                        className={`toggle-button ${isMusicEnabled ? 'active' : ''}`}
                        onClick={toggleMusic}
                    >
                        {isMusicEnabled ? 'On' : 'Off'}
                    </button>
                </div>
            </div>

            <button className="secondary-button" onClick={onBack}>
                Back
            </button>
        </div>
    );
};
