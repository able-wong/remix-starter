/**
 * IMPORTANT: When adding new environment variables to this file, make sure to:
 * 1. Add them to the appropriate interface (ClientEnv or ServerEnv)
 * 2. Add them to the requiredVars array in getServerEnv if they are required
 * 3. Add them to the envVars object in vite.config.ts to make them available in development
 * 4. Update the .dev.vars file with the new variables
 */

import type { FirebaseConfig } from '~/interfaces/firebaseInterface';

// Frontend environment variables (safe to expose)
export interface ClientEnv {
  FIREBASE_CONFIG?: FirebaseConfig;
  APP_NAME: string;
}

// Server-side environment variables
export interface ServerEnv {
  FIREBASE_CONFIG?: string;
  FIREBASE_PROJECT_ID?: string;
  FIREBASE_SERVICE_ACCOUNT_KEY?: string;
  GOOGLE_GENERATIVE_AI_API_KEY?: string;
  GOOGLE_GENERATIVE_AI_MODEL_NAME?: string;
}

type ClientEnvKey = 'FIREBASE_CONFIG' | 'APP_NAME';
type ServerEnvKey = keyof ServerEnv;

interface AppContext {
  env?: Partial<Record<ClientEnvKey | ServerEnvKey, string>>;
}

/**
 * Get environment variables for client-side usage
 * Only returns safe-to-expose variables
 *
 * Environment Variable Priority:
 * 1. Context environment (context.env)
 * 2. Process environment (process.env)
 *
 * Optional Environment Variables:
 * - FIREBASE_CONFIG: JSON string containing Firebase configuration (only required for Firebase functionality)
 * - APP_NAME: Application name used for logging (defaults to 'remix-cloudflare-app')
 *
 * Example .env file:
 * ```
 * FIREBASE_CONFIG={"apiKey":"...","authDomain":"...","projectId":"...","storageBucket":"...","messagingSenderId":"...","appId":"..."}
 * APP_NAME=my-awesome-app
 * ```
 */
export function getClientEnv(context: AppContext = {}): ClientEnv {
  const getEnvVar = (key: ClientEnvKey): string | undefined => {
    return (
      context?.env?.[key] || // Context environment
      (typeof process !== 'undefined' ? process.env[key] : undefined) // Process environment
    );
  };

  const firebaseConfig = getEnvVar('FIREBASE_CONFIG');
  let parsedFirebaseConfig: FirebaseConfig | undefined;

  if (firebaseConfig) {
    try {
      parsedFirebaseConfig = JSON.parse(firebaseConfig);
    } catch {
      throw new Error(
        'FIREBASE_CONFIG environment variable contains invalid JSON. Please ensure it is properly formatted.',
      );
    }
  }

  return {
    FIREBASE_CONFIG: parsedFirebaseConfig,
    APP_NAME: getEnvVar('APP_NAME') || 'remix-app',
  };
}

/**
 * Get environment variables for server-side usage
 * Includes all environment variables
 *
 * Environment Variable Priority:
 * 1. Context environment (context.env)
 * 2. Process environment (process.env)
 *
 * Optional Environment Variables:
 * - FIREBASE_CONFIG: JSON string containing Firebase configuration (only required for Firebase functionality)
 * - FIREBASE_PROJECT_ID: Firebase Project ID (only required for Firebase functionality)
 * - FIREBASE_SERVICE_ACCOUNT_KEY: Firebase service account key (only required for Firebase functionality)
 * - GOOGLE_GENERATIVE_AI_API_KEY: Gemini API key (only required for AI functionality)
 * - GOOGLE_GENERATIVE_AI_MODEL_NAME: Gemini model name (only required for AI functionality)
 */
export function getServerEnv(context: AppContext = {}): ServerEnv {
  const getEnvVar = (key: ServerEnvKey): string | undefined => {
    return (
      context?.env?.[key] || // Context environment
      (typeof process !== 'undefined' ? process.env[key] : undefined) // Process environment
    );
  };

  return {
    FIREBASE_CONFIG: getEnvVar('FIREBASE_CONFIG'),
    FIREBASE_PROJECT_ID: getEnvVar('FIREBASE_PROJECT_ID'),
    FIREBASE_SERVICE_ACCOUNT_KEY: getEnvVar('FIREBASE_SERVICE_ACCOUNT_KEY'),
    GOOGLE_GENERATIVE_AI_API_KEY: getEnvVar('GOOGLE_GENERATIVE_AI_API_KEY'),
    GOOGLE_GENERATIVE_AI_MODEL_NAME: getEnvVar(
      'GOOGLE_GENERATIVE_AI_MODEL_NAME',
    ),
  };
}
