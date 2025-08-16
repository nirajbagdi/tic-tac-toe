import React, { useEffect, useState } from 'react';
import { GameSession } from '../types';
import { gameApi } from '../api/gameApi';

interface SessionListProps {
    onJoinSession: (sessionId: string) => void;
    onBack: () => void;
}

export const SessionList: React.FC<SessionListProps> = ({
    onJoinSession,
    onBack,
}) => {
    const [sessions, setSessions] = useState<GameSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const activeSessions = await gameApi.getAllSessions();
                setSessions(activeSessions);
            } catch (err) {
                setError('Failed to load game sessions');
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
        const interval = setInterval(fetchSessions, 5000); // Refresh every 5 seconds

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div>Loading sessions...</div>;
    }

    if (error) {
        return (
            <div>
                <p>{error}</p>
                <button onClick={onBack}>Back</button>
            </div>
        );
    }

    return (
        <div className="session-list">
            <h2>Active Game Sessions</h2>
            {sessions.length === 0 ? (
                <p>No active sessions found</p>
            ) : (
                <div className="session-grid">
                    {sessions.map((session) => (
                        <button
                            key={session.id}
                            className="session-item"
                            onClick={() => onJoinSession(session.id)}
                        >
                            <div>Session {session.id.slice(0, 8)}</div>
                            <div className="session-status">
                                {session.result
                                    ? 'Game Over'
                                    : `Current Turn: ${session.currentPlayer}`}
                            </div>
                        </button>
                    ))}
                </div>
            )}
            <button className="back-button" onClick={onBack}>
                Back
            </button>
        </div>
    );
};
