

import React from 'react';
import LoadingSpinner from './LoadingSpinner.tsx';
import AudioPlayer from './AudioPlayer.tsx';
import CopyButton from './CopyButton.tsx';
import { GrammarCorrectionResult, TranslateResult, WordMeaningResult } from '../../services/geminiService.ts';


interface ResultCardProps {
    isLoading: boolean;
    translateResult?: TranslateResult | null;
    wordMeaningResult?: WordMeaningResult | null;
    grammarResult?: GrammarCorrectionResult | null;
}

const ResultCard: React.FC<ResultCardProps> = ({ isLoading, translateResult, wordMeaningResult, grammarResult }) => {
    
    const hasContent = !isLoading && (
        (translateResult && translateResult.length > 0) ||
        (grammarResult && grammarResult.correctedSentence) ||
        wordMeaningResult
    );

    const renderSection = (title: string, icon: React.ReactNode, content: React.ReactNode) => (
        <div>
            <h3 className="flex items-center gap-2 text-base font-semibold text-slate-700">
                {icon}
                <span>{title}</span>
            </h3>
            <div className="mt-2 ml-7">
                {content}
            </div>
        </div>
    );

    return (
        <div className="mt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
                Kết quả
            </label>
            <div className="relative w-full min-h-[116px] p-4 bg-slate-100 border border-slate-200 rounded-lg flex items-start">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-500 bg-slate-100/80 rounded-lg">
                        <LoadingSpinner />
                        <span>AI is thinking...</span>
                    </div>
                )}
                {!isLoading && !hasContent && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-slate-400 text-center">Your result will appear here.</p>
                    </div>
                )}
                {hasContent && (
                    <div className="w-full text-slate-800 space-y-5">
                        {/* Render Translation Result */}
                        {translateResult && translateResult.map((item, index) => (
                             <div key={index} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                                <h3 className="flex items-center gap-2 text-base font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-md -mt-1 -mx-1 mb-3">
                                    <ContextIcon />
                                    <span>Ngữ cảnh: {item.context}</span>
                                </h3>
                                <div className="space-y-2">
                                     <p className="font-semibold text-slate-800">{item.translation}</p>
                                     <p className="text-sm text-slate-600">{item.explanation}</p>
                                </div>
                            </div>
                        ))}

                        {/* Render Word Meaning Result */}
                        {wordMeaningResult && (
                            <>
                                {renderSection("Nghĩa của từ", <DefinitionIcon />, <p className="text-slate-700">{wordMeaningResult.definition}</p>)}
                                {renderSection("Loại từ", <WordTypeIcon />, <p className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">{wordMeaningResult.wordType}</p>)}
                                {renderSection("Phát âm", <PronunciationIcon />, (
                                    <div className="space-y-1">
                                        <div className="flex items-center">
                                            <span className="font-semibold w-8">UK</span>
                                            <span className="text-slate-600 font-mono">
                                                {wordMeaningResult.pronunciations.uk}
                                            </span>
                                            <CopyButton textToCopy={wordMeaningResult.pronunciations.uk} />
                                            {wordMeaningResult.ukAudio && <AudioPlayer audioData={wordMeaningResult.ukAudio} />}
                                        </div>
                                         <div className="flex items-center">
                                            <span className="font-semibold w-8">US</span>
                                            <span className="text-slate-600 font-mono">
                                                {wordMeaningResult.pronunciations.us}
                                            </span>
                                            <CopyButton textToCopy={wordMeaningResult.pronunciations.us} />
                                            {wordMeaningResult.usAudio && <AudioPlayer audioData={wordMeaningResult.usAudio} />}
                                        </div>
                                    </div>
                                ))}
                                {wordMeaningResult.wordForms.length > 0 && renderSection("Dạng từ", <WordFormsIcon />, (
                                    <div className="flex flex-wrap gap-2">
                                        {wordMeaningResult.wordForms.map((wordForm, index) => (
                                            <span key={index} className="text-sm text-slate-700 bg-slate-200 px-2.5 py-1 rounded-full">
                                                {wordForm.form} <em className="text-slate-500 not-italic">({wordForm.type})</em>
                                            </span>
                                        ))}
                                    </div>
                                ))}
                                {wordMeaningResult.exampleSentences.length > 0 && renderSection("Câu ví dụ", <ExampleIcon />, (
                                     <ul className="space-y-3">
                                        {wordMeaningResult.exampleSentences.map((ex, index) => (
                                            <li key={index} className="text-slate-700">
                                                <div className="flex items-start">
                                                    <span className="flex-grow">{ex.english}</span>
                                                    <CopyButton textToCopy={ex.english} />
                                                </div>
                                                <em className="text-slate-500 text-sm ml-4 block">- {ex.vietnamese}</em>
                                            </li>
                                        ))}
                                    </ul>
                                ))}
                            </>
                        )}

                        {/* Render Grammar Result */}
                        {grammarResult && grammarResult.correctedSentence && (
                            <>
                                {renderSection("Câu đã sửa (Corrected Sentence)", <CheckCircleIcon />, 
                                    <p className="text-base bg-green-50 border border-green-200 rounded-md px-3 py-2">
                                        <strong className="font-semibold text-green-800">{grammarResult.correctedSentence}</strong>
                                    </p>
                                )}
                                
                                {grammarResult.explanations.length > 0 && renderSection("Giải thích (Explanations)", <ExclamationIcon />, 
                                    <div className="space-y-3">
                                        {grammarResult.explanations.map((item, index) => (
                                            <div key={index} className="p-3 bg-white border border-slate-200 rounded-md shadow-sm">
                                                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                                                    <span className="text-sm line-through text-red-600 bg-red-50 px-2 py-0.5 rounded">{item.original}</span>
                                                    <ArrowRightIcon />
                                                    <span className="text-sm font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded">{item.corrected}</span>
                                                </div>
                                                <p className="mt-2 text-sm text-slate-600">{item.explanation}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                {grammarResult.alternatives.length > 0 && renderSection("Các cách viết lại câu (Alternative Rewrites)", <LightBulbIcon />, 
                                     <ul className="list-disc list-inside space-y-1 text-slate-700">
                                        {grammarResult.alternatives.map((alt, index) => (
                                            <li key={index} className="pl-1">{alt}</li>
                                        ))}
                                    </ul>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- ICONS ---

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ExclamationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.22 3.006-1.742 3.006H4.42c-1.522 0-2.492-1.672-1.742-3.006l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 011-1h.008a1 1 0 011 1v3.002a1 1 0 01-1 1h-.008a1 1 0 01-1-1V5z" clipRule="evenodd" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
);

const LightBulbIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 100 2h.01a1 1 0 100-2H11zM10 1a1 1 0 011 1v1a1 1 0 11-2 0V2a1 1 0 011-1zM9 15.01V17h2v-1.99a4.002 4.002 0 00-4-4H5a1 1 0 010-2h2a2 2 0 012 2v2.01zM14 11a1 1 0 10-2 0v.01a1 1 0 102 0V11z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.323 6.44a6 6 0 018.84-1.325 1 1 0 001.12-1.664 8 8 0 00-11.786 1.767 1 1 0 001.826.822z" clipRule="evenodd" />
    </svg>
);

const ContextIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
    </svg>
);

const DefinitionIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
);

const WordTypeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5a1 1 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);

const PronunciationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M6 3a1 1 0 011-1h.01a1 1 0 010 2H7a1 1 0 01-1-1zm2 10a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3 2a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);

const WordFormsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
    </svg>
);

const ExampleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm1.5 6.5a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5zm0 3a.5.5 0 01.5-.5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" clipRule="evenodd" />
    </svg>
);

export default ResultCard;