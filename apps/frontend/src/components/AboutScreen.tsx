import React from 'react';

interface AboutScreenProps {
    onBack: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
    return (
        <>
            <h2 className="screen-title">About</h2>
            <div className="about-content">
                <div className="mascot">(✿◠‿◠)</div>
                <p>A cute and friendly game of Tic Tac Toe!</p>
                <p>Play with a friend and enjoy the adorable themes.</p>
            </div>
            <button className="secondary-button" onClick={onBack}>
                Back
            </button>
        </>
    );
};
