import { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Theme } from './types';
import { HomeScreen } from './components/HomeScreen';
import { Game } from './components/Game';
import { ThemeScreen } from './components/ThemeScreen';
import { AboutScreen } from './components/AboutScreen';
import { Settings } from './components/Settings';

function App() {
    const [theme, setTheme] = useState<Theme>('default');
    const navigate = useNavigate();

    return (
        <div className="app">
            <Routes>
                <Route
                    path="/"
                    element={
                        <HomeScreen
                            onJoinSession={(sessionId) =>
                                navigate(`/game/${sessionId}`)
                            }
                            onThemes={() => navigate('/themes')}
                            onSettings={() => navigate('/settings')}
                            onAbout={() => navigate('/about')}
                        />
                    }
                />
                <Route
                    path="/game"
                    element={
                        <Game theme={theme} onBackToMenu={() => navigate('/')} />
                    }
                />
                <Route
                    path="/game/:sessionId"
                    element={
                        <Game theme={theme} onBackToMenu={() => navigate('/')} />
                    }
                />
                <Route
                    path="/themes"
                    element={
                        <ThemeScreen
                            theme={theme}
                            onThemeChange={setTheme}
                            onBack={() => navigate('/')}
                        />
                    }
                />
                <Route
                    path="/about"
                    element={<AboutScreen onBack={() => navigate('/')} />}
                />
                <Route
                    path="/settings"
                    element={<Settings onBack={() => navigate('/')} />}
                />
            </Routes>
        </div>
    );
}

export default App;
