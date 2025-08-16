import React from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { getSymbol } from '../utils/themeUtils';
import { Theme } from '../types';
import { useParams } from 'react-router-dom';

interface GameProps {
    onBackToMenu: () => void;
    theme: Theme;
}

export const Game: React.FC<GameProps> = ({ onBackToMenu, theme }) => {
    const { sessionId } = useParams();
    const { board, currentPlayer, winner, winningLine, handleClick, resetGame } =
        useGameLogic({ existingSessionId: sessionId });

    const isDraw = board.every((cell) => cell !== null) && !winner;

    const getMascotExpression = () => {
        if (!winner) return '(｡◕‿◕｡)';
        if (isDraw) return '(￣▽￣*)ゞ';
        return '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧';
    };

    return (
        <>
            <div className="mascot">{getMascotExpression()}</div>

            <div className="status">
                {winner
                    ? isDraw
                        ? "It's a draw!"
                        : `Player ${getSymbol(winner, theme)} wins!`
                    : `Current player: ${getSymbol(currentPlayer, theme)}`}
            </div>

            <div className="board">
                {board.map((value, index) => (
                    <button
                        key={index}
                        className={`cell ${
                            winningLine?.includes(index) ? 'winner' : ''
                        }`}
                        onClick={() => handleClick(index)}
                    >
                        {getSymbol(value, theme)}
                        {winningLine?.includes(index) && (
                            <div className="winner-overlay" />
                        )}
                    </button>
                ))}
            </div>

            <div className="button-group">
                <button className="secondary-button" onClick={onBackToMenu}>
                    Back to Menu
                </button>
                <button className="reset-button" onClick={resetGame}>
                    Play Again
                </button>
            </div>
        </>
    );
};
