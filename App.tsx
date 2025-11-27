import React, { useState, useCallback } from 'react';
import { AppMode } from './types.ts';
import TranslateChecker from './components/TranslateChecker.tsx';
import GrammarCorrector from './components/GrammarCorrector.tsx';
import WordMeaningChecker from './components/WordMeaningChecker.tsx';
import TabButton from './components/common/TabButton.tsx';

const App: React.FC = () => {
    const [mode, setMode] = useState<AppMode>(AppMode.Translate);

    const handleSetMode = useCallback((newMode: AppMode) => {
        setMode(newMode);
    }, []);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 to-slate-800">
            <div className="w-full max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                        AI Language <span className="text-indigo-400">Assistant</span>
                    </h1>
                    <p className="mt-2 text-lg text-slate-400">
                        Powered by Gemini
                    </p>
                </header>
                
                <main className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
                    <div className="flex gap-2 sm:gap-4 p-2 bg-slate-100 rounded-xl mb-6">
                        <TabButton
                            label="Dịch & Kiểm tra"
                            icon={<TranslateIcon />}
                            isActive={mode === AppMode.Translate}
                            onClick={() => handleSetMode(AppMode.Translate)}
                        />
                        <TabButton
                            label="Sửa Ngữ pháp"
                            icon={<GrammarIcon />}
                            isActive={mode === AppMode.Grammar}
                            onClick={() => handleSetMode(AppMode.Grammar)}
                        />
                         <TabButton
                            label="Kiểm tra nghĩa"
                            icon={<WordMeaningIcon />}
                            isActive={mode === AppMode.WordMeaning}
                            onClick={() => handleSetMode(AppMode.WordMeaning)}
                        />
                    </div>

                    <div>
                        {mode === AppMode.Translate && <TranslateChecker />}
                        {mode === AppMode.Grammar && <GrammarCorrector />}
                        {mode === AppMode.WordMeaning && <WordMeaningChecker />}
                    </div>
                </main>

                 <footer className="text-center mt-8">
                    <p className="text-sm text-slate-500">
                        Developed by linnv
                    </p>
                </footer>
            </div>
        </div>
    );
};

const TranslateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.19 1.46 2.51 1.9 4.02h-3.8c.44-1.51 1.07-2.83 1.9-4.02zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2 0 .68.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.19-1.46-2.51-1.9-4.02h3.8c-.44 1.51-1.07 2.83-1.9-4.02zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2 0-.68.07-1.35.16-2h4.68c.09.65.16 1.32.16 2 0 .68-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2 0-.68-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
    </svg>
);

const GrammarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1.04 14.84l-2.12-2.13-1.41 1.42L9.41 18l-1.99-1.99 1.41-1.41 2 2 4.24-4.24 1.42 1.41L12.96 16.84zM13 9V3.5L18.5 9H13z"/>
    </svg>
);

const WordMeaningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
    </svg>
);


export default App;