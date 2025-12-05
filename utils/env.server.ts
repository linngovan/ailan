/**
 * Environment validation and setup
 */

import { ERROR_MESSAGES } from '../constants.ts';

/**
 * Validates required environment variables on app startup
 */
export const validateEnvironment = (): void => {
  const requiredVars = ['GEMINI_API_KEY'] as const;
  const missingVars: string[] = [];

  for (const envVar of requiredVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  if (missingVars.length > 0) {
    const message = `Missing required environment variables: ${missingVars.join(', ')}\n\nPlease set these variables in your .env.local file.`;
    console.error('❌ Environment Validation Failed:', message);
    // Show a user-friendly warning instead of crashing
    console.warn(ERROR_MESSAGES.API_KEY_MISSING);
  }
};

/**
 * Logs environment configuration (without exposing sensitive data)
 */
export const logEnvironmentConfig = (): void => {
  console.log('🚀 Environment Configuration:');
  console.log(
    `   API Key Configured: ${process.env.GEMINI_API_KEY ? '✅ Yes' : '❌ No'}`
  );
};
