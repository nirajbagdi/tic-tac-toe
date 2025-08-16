import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

interface SoundContextType {
    isSoundEnabled: boolean;
    isMusicEnabled: boolean;
    toggleSound: () => void;
    toggleMusic: () => void;
    playPop: () => void;
    playWin: () => void;
    playDraw: () => void;
}

const SoundContext = createContext<SoundContextType | null>(null);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [isSoundEnabled, setSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('isSoundEnabled');
        return saved ? JSON.parse(saved) : false;
    });
    const [isMusicEnabled, setMusicEnabled] = useState(() => {
        const saved = localStorage.getItem('isMusicEnabled');
        return saved ? JSON.parse(saved) : false;
    });

    const popSound = useRef<HTMLAudioElement | null>(null);
    const winSound = useRef<HTMLAudioElement | null>(null);
    const drawSound = useRef<HTMLAudioElement | null>(null);
    const bgMusic = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Initialize audio elements
        popSound.current = new Audio('/sounds/pop.mp3');
        winSound.current = new Audio('/sounds/win.mp3');
        drawSound.current = new Audio('/sounds/draw.mp3');
        bgMusic.current = new Audio('/sounds/background.mp3');

        if (bgMusic.current) {
            bgMusic.current.loop = true;
            bgMusic.current.volume = 0.3;
        }

        return () => {
            // Cleanup
            if (bgMusic.current) {
                bgMusic.current.pause();
            }
        };
    }, []);

    useEffect(() => {
        localStorage.setItem('isSoundEnabled', JSON.stringify(isSoundEnabled));
    }, [isSoundEnabled]);

    useEffect(() => {
        localStorage.setItem('isMusicEnabled', JSON.stringify(isMusicEnabled));
        if (bgMusic.current) {
            if (isMusicEnabled) {
                bgMusic.current.play().catch(() => {
                    // Autoplay was prevented
                    setMusicEnabled(false);
                });
            } else {
                bgMusic.current.pause();
            }
        }
    }, [isMusicEnabled]);

    const playSound = (audio: HTMLAudioElement | null) => {
        if (audio && isSoundEnabled) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Handle playback error
            });
        }
    };

    const toggleSound = () => setSoundEnabled((prev: boolean) => !prev);
    const toggleMusic = () => setMusicEnabled((prev: boolean) => !prev);
    const playPop = () => playSound(popSound.current);
    const playWin = () => playSound(winSound.current);
    const playDraw = () => playSound(drawSound.current);

    return (
        <SoundContext.Provider
            value={{
                isSoundEnabled,
                isMusicEnabled,
                toggleSound,
                toggleMusic,
                playPop,
                playWin,
                playDraw,
            }}
        >
            {children}
        </SoundContext.Provider>
    );
};

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};
