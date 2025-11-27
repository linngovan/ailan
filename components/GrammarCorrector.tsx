
import React, { useState, useCallback } from 'react';
import { correctGrammar, GrammarCorrectionResult } from '../services/geminiService.ts';
import ResultCard from './common/ResultCard.tsx';
import LoadingSpinner from './common/LoadingSpinner.tsx';
import FollowUpChat from './common/FollowUpChat.tsx';
import { useChat } from '../hooks/useChat.ts';
import { LOADING_MESSAGES, BUTTON_LABELS, PLACEHOLDERS, ERROR_MESSAGES } from '../constants.ts';

const GrammarCorrector: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [resultData, setResultData] = useState<GrammarCorrectionResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const { chatMessages, isChatLoading, sendChatMessage, resetChat } = useChat();

    const handleCorrection = useCallback(async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setError('');
        setResultData(null);
        resetChat(); // Reset chat on new correction
        try {
            const correction = await correctGrammar(inputText);
            setResultData(correction);
        } catch (err: any) {
            setError(err.message || ERROR_MESSAGES.GRAMMAR_ERROR);
        } finally {
            setIsLoading(false);
        }
    }, [inputText, resetChat]);

    const handleSendChatMessage = useCallback(async (question: string) => {
        if (!resultData) return;

        const contextPrompt = `Original English Sentence: "${inputText}"\n\nAI Grammar Correction and Analysis:\n${JSON.stringify(resultData, null, 2)}`;
        await sendChatMessage(question, contextPrompt, chatMessages);
    }, [inputText, resultData, chatMessages, sendChatMessage]);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="english-input" className="block text-sm font-medium text-slate-700 mb-1">
                    Nhập câu tiếng Anh
                </label>
                <textarea
                    id="english-input"
                    value={inputText}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
                    placeholder={PLACEHOLDERS.ENGLISH_INPUT}
                    rows={4}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200"
                    disabled={isLoading}
                />
            </div>
            <button
                onClick={handleCorrection}
                disabled={isLoading || !inputText.trim()}
                className="inline-flex items-center justify-center w-full px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? (
                    <>
                        <LoadingSpinner />
                        {LOADING_MESSAGES.CORRECTING}
                    </>
                ) : (
                    BUTTON_LABELS.CORRECT_GRAMMAR
                )}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <ResultCard isLoading={isLoading} grammarResult={resultData} />

            {/* Conditionally render FollowUpChat */}
            {!isLoading && resultData && resultData.correctedSentence && (
                <FollowUpChat
                    messages={chatMessages}
                    isLoading={isChatLoading}
                    onSendMessage={handleSendChatMessage}
                />
            )}
        </div>
    );
};

export default GrammarCorrector;
