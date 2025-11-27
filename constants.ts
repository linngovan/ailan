/**
 * Application constants and configuration
 */

// API Configuration
export const API_CONFIG = {
  MODEL: 'gemini-2.5-flash',
  MAX_RETRIES: 3,
  TIMEOUT_MS: 30000,
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_DELAY_MS: 200,
  WORD_SUGGESTIONS_LIMIT: 5,
  MIN_HEIGHT_RESULT_CARD: '116px',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  TRANSLATION_ERROR: 'Sorry, an error occurred during translation. Please try again.',
  GRAMMAR_ERROR: 'Sorry, an error occurred during grammar correction. Please try again.',
  MEANING_ERROR: 'Sorry, an error occurred while checking word meaning. Please try again.',
  CHAT_ERROR: 'Sorry, I encountered an error. Please try again.',
  API_KEY_MISSING: 'API Key is not configured. Please set GEMINI_API_KEY in .env.local',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  INVALID_INPUT: 'Please enter some text.',
} as const;

// Loading Messages
export const LOADING_MESSAGES = {
  TRANSLATING: 'Đang dịch...',
  CORRECTING: 'Đang sửa...',
  CHECKING: 'Đang kiểm tra...',
  THINKING: 'AI is thinking...',
} as const;

// Button Labels
export const BUTTON_LABELS = {
  TRANSLATE: 'Dịch sang tiếng Anh',
  CORRECT_GRAMMAR: 'Sửa Ngữ pháp',
  CHECK_MEANING: 'Kiểm tra nghĩa',
  SEND: 'Gửi',
} as const;

// Placeholder Texts
export const PLACEHOLDERS = {
  VIETNAMESE_INPUT: 'Ví dụ: Chúc bạn một ngày tốt lành!',
  ENGLISH_INPUT: 'e.g., He don\'t know what to do.',
  WORD_INPUT: 'Enter an English word...',
} as const;

// Validation Rules
export const VALIDATION = {
  MIN_INPUT_LENGTH: 1,
  MAX_SUGGESTIONS: 5,
} as const;
