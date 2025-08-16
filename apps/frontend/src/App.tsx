import { useState } from 'react';
import { Screen, Theme } from './types';
import { HomeScreen } from './components/HomeScreen';
import { Game } from './components/Game';
import { ThemeScreen } from './components/ThemeScreen';
import { AboutScreen } from './components/AboutScreen';
import { Settings } from './components/Settings';

function App() {
    const [screen, setScreen] = useState<Screen>('home');
    const [theme, setTheme] = useState<Theme>('default');

    return (
        <div className="app">
            {screen === 'home' && (
                <HomeScreen
                    onPlay={() => setScreen('game')}
                    onThemes={() => setScreen('themes')}
                    onSettings={() => setScreen('settings')}
                    onAbout={() => setScreen('about')}
                />
            )}
            {screen === 'game' && (
                <Game theme={theme} onBackToMenu={() => setScreen('home')} />
            )}
            {screen === 'themes' && (
                <ThemeScreen
                    theme={theme}
                    onThemeChange={setTheme}
                    onBack={() => setScreen('home')}
                />
            )}
            {screen === 'about' && <AboutScreen onBack={() => setScreen('home')} />}
            {screen === 'settings' && <Settings onBack={() => setScreen('home')} />}
        </div>
    );
}

export default App;
