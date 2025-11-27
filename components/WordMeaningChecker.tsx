
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { getWordMeaning, WordMeaningResult } from '../services/geminiService.ts';
import ResultCard from './common/ResultCard.tsx';
import LoadingSpinner from './common/LoadingSpinner.tsx';
import { wordList } from '../data/wordlist.ts';
import FollowUpChat from './common/FollowUpChat.tsx';
import { useChat } from '../hooks/useChat.ts';
import { UI_CONFIG, LOADING_MESSAGES, BUTTON_LABELS, PLACEHOLDERS, ERROR_MESSAGES } from '../constants.ts';

const WordMeaningChecker: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [resultData, setResultData] = useState<WordMeaningResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isSuggestionsVisible, setIsSuggestionsVisible] = useState<boolean>(false);

    const debounceTimeoutRef = useRef<number | null>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // State for follow-up chat
    const { chatMessages, isChatLoading, sendChatMessage, resetChat } = useChat();

    const handleCheckMeaning = useCallback(async (word: string) => {
        const trimmedWord = word.trim();
        if (!trimmedWord) return;
        setIsLoading(true);
        setError('');
        setResultData(null);
        resetChat(); // Reset chat
        setIsSuggestionsVisible(false);
        try {
            const meaning = await getWordMeaning(trimmedWord);
            setResultData(meaning);
        } catch (err: any) {
            setError(err.message || ERROR_MESSAGES.MEANING_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, [resetChat]);
    
    const handleSendChatMessage = useCallback(async (question: string) => {
        if (!resultData) return;

        // Create a version of the result data without the audio for a cleaner context prompt
        const contextData = { ...resultData, ukAudio: undefined, usAudio: undefined };
        const contextPrompt = `Original English Word: "${inputText}"\n\nAI Definition and Analysis:\n${JSON.stringify(contextData, null, 2)}`;
        await sendChatMessage(question, contextPrompt, chatMessages);
    }, [inputText, resultData, chatMessages, sendChatMessage]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputText(value);

        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        if (!value.trim()) {
            setSuggestions([]);
            setIsSuggestionsVisible(false);
            return;
        }

        debounceTimeoutRef.current = window.setTimeout(() => {
            const filteredSuggestions = wordList
                .filter(word => word.toLowerCase().startsWith(value.toLowerCase()))
                .slice(0, UI_CONFIG.WORD_SUGGESTIONS_LIMIT); // Show top 5 suggestions
            setSuggestions(filteredSuggestions);
            setIsSuggestionsVisible(filteredSuggestions.length > 0);
        }, UI_CONFIG.DEBOUNCE_DELAY_MS); // 200ms debounce time
    };
    
    const handleSuggestionClick = (word: string) => {
        setInputText(word);
        handleCheckMeaning(word);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
                setIsSuggestionsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="flex flex-col gap-4">
            <div className="relative">
                <label htmlFor="english-word-input" className="block text-sm font-medium text-slate-700 mb-1">
                    Nhập một từ tiếng Anh
                </label>
                <input
                    type="text"
                    id="english-word-input"
                    value={inputText}
                    onChange={handleInputChange}
                    onFocus={handleInputChange}
                    autoComplete="off"
                    placeholder="Ví dụ: benevolent"
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
                    disabled={isLoading}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter' && !isLoading && inputText.trim()) {
                            handleCheckMeaning(inputText);
                        }
                    }}
                />
                {isSuggestionsVisible && (
                    <div ref={suggestionsRef} className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        <ul className="py-1">
                            {suggestions.map((word: string) => (
                                <li 
                                    key={word}
                                    onClick={() => handleSuggestionClick(word)}
                                    className="px-4 py-2 text-slate-700 hover:bg-indigo-100 cursor-pointer"
                                >
                                    {word}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <button
                onClick={() => handleCheckMeaning(inputText)}
                disabled={isLoading || !inputText.trim()}
                className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        Đang kiểm tra...
                    </>
                ) : (
                    'Kiểm tra nghĩa'
                )}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <ResultCard isLoading={isLoading} wordMeaningResult={resultData} />

             {/* Conditionally render FollowUpChat */}
            {!isLoading && resultData && (
                <FollowUpChat
                    messages={chatMessages}
                    isLoading={isChatLoading}
                    onSendMessage={handleSendChatMessage}
                />
            )}
        </div>
    );
};

export default WordMeaningChecker;