
import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';
import { ChatMessage } from '../../types.ts';

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
    </svg>
);

interface FollowUpChatProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
}

const FollowUpChat: React.FC<FollowUpChatProps> = ({ messages, onSendMessage, isLoading }) => {
    const [input, setInput] = useState('');
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Scroll to bottom when new messages are added
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="mt-6 border-t border-slate-200 pt-4 animate-fade-in">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Hỏi đáp thêm với AI</h3>
            <div className="bg-slate-50 p-3 sm:p-4 rounded-lg border border-slate-200">
                <div ref={chatContainerRef} className="max-h-80 overflow-y-auto pr-2 space-y-4 mb-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div
                                className={`max-w-[85%] rounded-xl px-4 py-2.5 shadow-sm result-content ${
                                    msg.role === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-white text-slate-800 border border-slate-200'
                                }`}
                                dangerouslySetInnerHTML={{ __html: marked.parse(msg.text.replace(/<h3>/g, '<strong>').replace(/<\/h3>/g, '</strong><br>'), { breaks: true, gfm: true }) as string }}
                            />
                        </div>
                    ))}
                    {isLoading && messages.length > 0 && messages[messages.length-1].role === 'user' && (
                        <div className="flex justify-start">
                             <div className="max-w-[85%] rounded-xl px-4 py-2.5 bg-white text-slate-700 border border-slate-200 inline-flex items-center gap-2 shadow-sm">
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="relative">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Đặt câu hỏi của bạn ở đây..."
                        rows={1}
                        className="w-full resize-none p-3 pr-14 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow duration-200 disabled:bg-slate-100"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 bottom-1.5 p-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all"
                        aria-label="Send message"
                    >
                        <SendIcon />
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
                .result-content h3, .result-content strong { all: unset; font-weight: 600; color: inherit; }
                .result-content p { margin: 0; }
                .result-content ul { margin-top: 0.5rem; }
            `}</style>
        </div>
    );
};

export default FollowUpChat;
