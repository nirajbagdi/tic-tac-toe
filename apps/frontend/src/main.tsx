import { createRoot } from 'react-dom/client';

import { SoundProvider } from './contexts/SoundContext.js';
import App from './App.js';

import './styles/index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
    <SoundProvider>
        <App />
    </SoundProvider>
);
