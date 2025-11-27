

import { GoogleGenAI, Modality, Content, Type } from "@google/genai";
import { ChatMessage } from '../types.ts';

// FIX: Initialized GoogleGenAI client directly with process.env.API_KEY to adhere to coding guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

export interface TranslateResultItem {
  context: string;
  translation: string;
  explanation: string;
}
export type TranslateResult = TranslateResultItem[];

export const translateAndCheck = async (vietnameseText: string): Promise<TranslateResult> => {
  if (!vietnameseText.trim()) {
    return [];
  }
  
  const translateSchema = {
    type: Type.ARRAY,
    description: 'An array of three translation objects, each for a different context.',
    items: {
      type: Type.OBJECT,
      properties: {
        context: {
          type: Type.STRING,
          description: 'The context of the translation (e.g., Formal, Informal, Technical).',
        },
        translation: {
          type: Type.STRING,
          description: 'The English translation.',
        },
        explanation: {
          type: Type.STRING,
          description: 'A brief explanation in Vietnamese of why this translation fits the context.',
        },
      },
      required: ['context', 'translation', 'explanation'],
    },
  };

  try {
    const prompt = `Translate the following Vietnamese sentence into English and provide three different translations that fit different contexts.
Your response must be a JSON array that adheres to the provided schema.

- For the \`explanation\` field, you must provide the explanation in **Vietnamese**.

Vietnamese: "${vietnameseText}"
`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: translateSchema,
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error during translation:", error);
    // FIX: Throw an error to let the UI component handle the error state, rather than returning an error string.
    throw new Error("Sorry, an error occurred during translation. Please try again.");
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
  if (!englishText.trim()) {
    return { correctedSentence: '', explanations: [], alternatives: [] };
  }
  
  const grammarSchema = {
    type: Type.OBJECT,
    properties: {
      correctedSentence: {
        type: Type.STRING,
        description: 'The grammatically correct version of the sentence.',
      },
      explanations: {
        type: Type.ARRAY,
        description: 'An array of objects, where each object explains a specific grammar error.',
        items: {
          type: Type.OBJECT,
          properties: {
            original: {
              type: Type.STRING,
              description: 'The incorrect word or phrase from the original sentence.',
            },
            corrected: {
              type: Type.STRING,
              description: 'The corrected word or phrase.',
            },
            explanation: {
              type: Type.STRING,
              description: 'A detailed explanation of the error, in Vietnamese.',
            },
          },
          required: ['original', 'corrected', 'explanation'],
        },
      },
      alternatives: {
        type: Type.ARRAY,
        description: 'An array of three alternative ways to phrase the sentence (e.g., more natural, formal, or concise).',
        items: {
          type: Type.STRING,
        },
      },
    },
    required: ['correctedSentence', 'explanations', 'alternatives'],
  };

  try {
    const prompt = `Please act as an expert English grammar checker. Analyze the following English sentence, identify all grammatical and spelling errors, and provide the corrected version along with clear explanations and alternative phrasings.

Your response must be a JSON object that adheres to the provided schema.

- For the \`explanation\` field in the \`explanations\` array, you must provide the explanation in **Vietnamese**.
- For the \`alternatives\` array, provide three distinct options.

Original Sentence: "${englishText}"
`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
       config: {
        responseMimeType: 'application/json',
        responseSchema: grammarSchema,
      },
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Error during grammar correction:", error);
    // FIX: Throw an error to let the UI component handle the error state, rather than returning an error string.
    throw new Error("Sorry, an error occurred while correcting grammar. Please try again.");
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
  if (!englishWord.trim()) {
    return null;
  }

  const wordMeaningSchema = {
    type: Type.OBJECT,
    properties: {
      definition: {
        type: Type.STRING,
        description: 'The definition of the word in Vietnamese.',
      },
      wordType: {
        type: Type.STRING,
        description: 'The part of speech (e.g., Noun, Verb, Adjective).',
      },
      pronunciations: {
        type: Type.OBJECT,
        properties: {
          uk: { type: Type.STRING, description: 'The phonetic transcription for UK English, wrapped in slashes (e.g., /bəˈnevələnt/).' },
          us: { type: Type.STRING, description: 'The phonetic transcription for US English, wrapped in slashes (e.g., /bəˈnevələnt/).' },
        },
        required: ['uk', 'us'],
      },
      wordForms: {
        type: Type.ARRAY,
        description: 'A list of objects, where each object contains a different form of the word and its part of speech (e.g., Noun, Verb, Adverb).',
        items: {
          type: Type.OBJECT,
          properties: {
            form: { type: Type.STRING, description: 'The word form.' },
            type: { type: Type.STRING, description: 'The part of speech for the word form (e.g., "Noun", "Adverb", "Adjective").' },
          },
          required: ['form', 'type'],
        },
      },
      exampleSentences: {
        type: Type.ARRAY,
        description: 'An array of at least two example sentence objects.',
        items: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING, description: 'The example sentence in English.' },
            vietnamese: { type: Type.STRING, description: 'The Vietnamese translation of the example sentence.' },
          },
          required: ['english', 'vietnamese'],
        },
      },
    },
    required: ['definition', 'wordType', 'pronunciations', 'wordForms', 'exampleSentences'],
  };
  
  try {
    const textPrompt = `Analyze the following English word and provide a detailed breakdown.
Your response must be a JSON object that adheres to the provided schema.

Word: "${englishWord}"
`;
    
    const [textResponse, ukAudioResponse, usAudioResponse] = await Promise.allSettled([
      // Text generation
      ai.models.generateContent({
        model: model,
        contents: textPrompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: wordMeaningSchema,
        },
      }),
      // UK Audio Generation (Puck has a British-like accent)
      ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: englishWord }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
        },
      }),
      // US Audio Generation (Zephyr has an American-like accent)
      ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: englishWord }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
        },
      })
    ]);

    if (textResponse.status === 'rejected') {
        console.error("Error during word meaning text generation:", textResponse.reason);
        throw new Error("Sorry, an error occurred while fetching the definition.");
    }
    const textData = JSON.parse(textResponse.value.text.trim());

    const ukAudio = ukAudioResponse.status === 'fulfilled' ? ukAudioResponse.value.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null : null;
    if (ukAudioResponse.status === 'rejected') {
        console.warn("Could not generate UK audio:", ukAudioResponse.reason);
    }
    
    const usAudio = usAudioResponse.status === 'fulfilled' ? usAudioResponse.value.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null : null;
    if (usAudioResponse.status === 'rejected') {
        console.warn("Could not generate US audio:", usAudioResponse.reason);
    }

    return { ...textData, ukAudio, usAudio };

  } catch (error) {
    console.error("Error during word meaning check:", error);
    throw new Error("Sorry, an error occurred while checking the word. Please try again.");
  }
};

export const askFollowUp = async (
  contextPrompt: string, 
  chatHistory: ChatMessage[], 
  newQuestion: string
): Promise<string> => {
  if (!newQuestion.trim()) {
    return "";
  }
  try {
    const contents: Content[] = [
      // System instruction / initial context
      {
        role: 'user',
        parts: [{ text: `You are an AI assistant. The user is asking follow-up questions about a specific context. Here is the context:\n\n${contextPrompt}\n\nNow, answer the user's questions. Be helpful and concise.` }]
      },
      {
        role: 'model',
        parts: [{ text: 'Okay, I understand the context. How can I help you further?' }]
      },
      // Previous chat history
      ...chatHistory.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
      // The new question
      {
        role: 'user',
        parts: [{ text: newQuestion }],
      },
    ];

    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error during follow-up question:", error);
    throw new Error("Sorry, an error occurred while answering your question. Please try again.");
  }
};