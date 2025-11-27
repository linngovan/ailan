
import React, { useState, useCallback } from 'react';
import { correctGrammar, askFollowUp, GrammarCorrectionResult } from '../services/geminiService.ts';
import ResultCard from './common/ResultCard.tsx';
import LoadingSpinner from './common/LoadingSpinner.tsx';
import FollowUpChat from './common/FollowUpChat.tsx';
import { ChatMessage } from '../types.ts';

const GrammarCorrector: React.FC = () => {
    const [inputText, setInputText] = useState<string>('');
    const [resultData, setResultData] = useState<GrammarCorrectionResult | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    // State for follow-up chat
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

    const handleCorrection = useCallback(async () => {
        if (!inputText.trim()) return;
        setIsLoading(true);
        setError('');
        setResultData(null);
        setChatMessages([]); // Reset chat on new correction
        try {
            const correction = await correctGrammar(inputText);
            setResultData(correction);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [inputText]);

    const handleSendChatMessage = useCallback(async (question: string) => {
        setIsChatLoading(true);
        const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: question }];
        setChatMessages(newMessages);

        try {
            const contextPrompt = `Original English Sentence: "${inputText}"\n\nAI Grammar Correction and Analysis:\n${JSON.stringify(resultData, null, 2)}`;
            const response = await askFollowUp(contextPrompt, chatMessages, question);
            setChatMessages([...newMessages, { role: 'model', text: response }]);
        } catch (err: any) {
            setChatMessages([...newMessages, { role: 'model', text: `Sorry, I encountered an error: ${err.message}` }]);
        } finally {
            setIsChatLoading(false);
        }
    }, [inputText, resultData, chatMessages]);

    return (
        <div className="flex flex-col gap-4">
            <div>
                <label htmlFor="english-input" className="block text-sm font-medium text-slate-700 mb-1">
                    Nhập câu tiếng Anh
                </label>
                <textarea
                    id="english-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="e.g., He don't know what to do."
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
                        Đang sửa...
                    </>
                ) : (
                    'Sửa Ngữ pháp'
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
