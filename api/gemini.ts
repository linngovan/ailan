import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Modality, Type } from "@google/genai";

// CORS headers for security
const corsHeaders = {
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Validate API key exists on server
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Get request body
    const { action, payload } = req.body;

    if (!action || !payload) {
      return res.status(400).json({ error: 'Missing action or payload' });
    }

    // Initialize Gemini AI client (server-side only)
    const ai = new GoogleGenAI({ apiKey });
    const model = 'gemini-2.5-flash';

    let result;

    switch (action) {
      case 'translate':
        result = await handleTranslate(ai, model, payload);
        break;
      
      case 'grammar':
        result = await handleGrammar(ai, model, payload);
        break;
      
      case 'wordMeaning':
        result = await handleWordMeaning(ai, model, payload);
        break;
      
      case 'chat':
        result = await handleChat(ai, model, payload);
        break;
      
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }

    return res.status(200).json({ success: true, data: result });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}

// Translation handler
async function handleTranslate(ai: GoogleGenAI, model: string, payload: any) {
  const { text } = payload;
  
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input');
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

  const prompt = `Translate the following Vietnamese sentence into English and provide three different translations that fit different contexts.
Your response must be a JSON array that adheres to the provided schema.

- For the \`explanation\` field, you must provide the explanation in **Vietnamese**.

Vietnamese: "${text}"
`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: translateSchema,
    },
  });

  if (!response.text) {
    throw new Error('Empty response from API');
  }
  
  return JSON.parse(response.text.trim());
}

// Grammar correction handler
async function handleGrammar(ai: GoogleGenAI, model: string, payload: any) {
  const { text } = payload;
  
  if (!text || typeof text !== 'string') {
    throw new Error('Invalid text input');
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

  const prompt = `Please act as an expert English grammar checker. Analyze the following English sentence, identify all grammatical and spelling errors, and provide the corrected version along with clear explanations and alternative phrasings.

Your response must be a JSON object that adheres to the provided schema.

- For the \`explanation\` field in the \`explanations\` array, you must provide the explanation in **Vietnamese**.
- For the \`alternatives\` array, provide three distinct options.

Original Sentence: "${text}"
`;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: grammarSchema,
    },
  });

  if (!response.text) {
    throw new Error('Empty response from API');
  }
  
  return JSON.parse(response.text.trim());
}

// Word meaning handler
async function handleWordMeaning(ai: GoogleGenAI, model: string, payload: any) {
  const { word } = payload;
  
  if (!word || typeof word !== 'string') {
    throw new Error('Invalid word input');
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

  const textPrompt = `Analyze the following English word and provide a detailed breakdown.
Your response must be a JSON object that adheres to the provided schema.

Word: "${word}"
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
      contents: [{ parts: [{ text: word }] }],
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
      contents: [{ parts: [{ text: word }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
      },
    })
  ]);

  if (textResponse.status === 'rejected') {
    throw new Error('Failed to generate word meaning');
  }

  if (!textResponse.value.text) {
    throw new Error('Empty response from API');
  }

  const textData = JSON.parse(textResponse.value.text.trim());
  const ukAudio = ukAudioResponse.status === 'fulfilled' ? ukAudioResponse.value.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null : null;
  const usAudio = usAudioResponse.status === 'fulfilled' ? usAudioResponse.value.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null : null;

  return { ...textData, ukAudio, usAudio };
}

// Chat handler
async function handleChat(ai: GoogleGenAI, model: string, payload: any) {
  const { contextPrompt, chatHistory, newQuestion } = payload;
  
  if (!newQuestion || typeof newQuestion !== 'string') {
    throw new Error('Invalid question input');
  }

  const contents = [
    {
      role: 'user',
      parts: [{ text: `You are an AI assistant. The user is asking follow-up questions about a specific context. Here is the context:\n\n${contextPrompt}\n\nNow, answer the user's questions. Be helpful and concise.` }]
    },
    {
      role: 'model',
      parts: [{ text: 'Okay, I understand the context. How can I help you further?' }]
    },
    ...chatHistory.map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: newQuestion }],
    },
  ];

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
  });

  if (!response.text) {
    throw new Error('Empty response from API');
  }
  
  return response.text.trim();
}
