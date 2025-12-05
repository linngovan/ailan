import { ChatMessage } from '../types.ts';
import { ERROR_MESSAGES } from '../constants.ts';

// API endpoint - use relative path for Vercel deployment
const API_ENDPOINT = '/api/gemini';

/**
 * Generic API call handler
 */
async function callAPI(action: string, payload: any): Promise<any> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API request failed');
    }

    return data.data;
  } catch (error: any) {
    console.error(`Error calling ${action}:`, error);
    throw error;
  }
}

export interface TranslateResultItem {
  context: string;
  translation: string;
  explanation: string;
}
export type TranslateResult = TranslateResultItem[];

export const translateAndCheck = async (vietnameseText: string): Promise<TranslateResult> => {
  const trimmed = vietnameseText.trim();
  if (!trimmed) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  try {
    return await callAPI('translate', { text: trimmed });
  } catch (error) {
    console.error("Error during translation:", error);
    throw new Error(ERROR_MESSAGES.TRANSLATION_ERROR);
  }
};

export interface GrammarCorrectionResult {
  correctedSentence: string;
  explanations: {
    original: string;
    corrected: string;
    explanation: string;
  }[];
  alternatives: string[];
}

export const correctGrammar = async (englishText: string): Promise<GrammarCorrectionResult> => {
  const trimmed = englishText.trim();
  if (!trimmed) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  try {
    return await callAPI('grammar', { text: trimmed });
  } catch (error) {
    console.error("Error during grammar correction:", error);
    throw new Error(ERROR_MESSAGES.GRAMMAR_ERROR);
  }
};

export interface WordMeaningResult {
  definition: string;
  wordType: string;
  pronunciations: {
    uk: string;
    us: string;
  };
  wordForms: {
    form: string;
    type: string;
  }[];
  exampleSentences: {
    english: string;
    vietnamese: string;
  }[];
  ukAudio: string | null;
  usAudio: string | null;
}

export const getWordMeaning = async (englishWord: string): Promise<WordMeaningResult | null> => {
  const trimmed = englishWord.trim();
  if (!trimmed) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  try {
    return await callAPI('wordMeaning', { word: trimmed });
  } catch (error) {
    console.error("Error during word meaning check:", error);
    throw new Error(ERROR_MESSAGES.MEANING_ERROR);
  }
};

export const askFollowUp = async (
  contextPrompt: string,
  chatHistory: ChatMessage[],
  newQuestion: string
): Promise<string> => {
  const trimmedQuestion = newQuestion.trim();
  if (!trimmedQuestion) {
    throw new Error(ERROR_MESSAGES.INVALID_INPUT);
  }

  try {
    return await callAPI('chat', {
      contextPrompt,
      chatHistory,
      newQuestion: trimmedQuestion
    });
  } catch (error) {
    console.error("Error during follow-up question:", error);
    throw new Error(ERROR_MESSAGES.CHAT_ERROR);
  }
};