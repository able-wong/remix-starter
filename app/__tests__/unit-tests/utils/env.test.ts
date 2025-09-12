import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import { getClientEnv, getServerEnv } from '~/utils/env';
import type { FirebaseConfig } from '~/interfaces/firebaseInterface';

describe('env.ts', () => {
  // Mock Firebase config for testing
  const mockFirebaseConfig: FirebaseConfig = {
    apiKey: 'test-api-key',
    authDomain: 'test-project.firebaseapp.com',
    projectId: 'test-project',
    storageBucket: 'test-project.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:test-app-id',
  };

  const mockFirebaseConfigString = JSON.stringify(mockFirebaseConfig);
  const mockProjectId = 'test-project-id';

  // Store original process.env to restore after tests
  const originalProcessEnv = process.env;

  beforeEach(() => {
    // Clear environment variables before each test
    process.env = { NODE_ENV: 'test' };
  });

  afterAll(() => {
    // Restore original process.env
    process.env = originalProcessEnv;
  });

  describe('getClientEnv', () => {
    it('should return parsed Firebase config from context environment', () => {
      const context = {
        env: {
          FIREBASE_CONFIG: mockFirebaseConfigString,
        },
      };

      const result = getClientEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: mockFirebaseConfig,
        APP_NAME: 'remix-app',
      });
    });

    it('should return custom app name from context', () => {
      const context = {
        env: {
          FIREBASE_CONFIG: mockFirebaseConfigString,
          APP_NAME: 'custom-app',
        },
      };

      const result = getClientEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: mockFirebaseConfig,
        APP_NAME: 'custom-app',
      });
    });

    it('should return parsed Firebase config from process.env', () => {
      process.env.FIREBASE_CONFIG = mockFirebaseConfigString;
      const context = {};

      const result = getClientEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: mockFirebaseConfig,
        APP_NAME: 'remix-app',
      });
    });

    it('should prioritize context environment over process.env', () => {
      process.env.FIREBASE_CONFIG = JSON.stringify({ apiKey: 'wrong-key' });
      const context = {
        env: {
          FIREBASE_CONFIG: mockFirebaseConfigString,
        },
      };

      const result = getClientEnv(context);

      expect(result).toEqual({
        APP_NAME: 'remix-app',
        FIREBASE_CONFIG: mockFirebaseConfig,
      });
    });

    it('should return undefined Firebase config when not set', () => {
      const context = {};

      const result = getClientEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: undefined,
        APP_NAME: 'remix-app',
      });
    });

    it('should throw error when FIREBASE_CONFIG contains invalid JSON', () => {
      const context = {
        env: {
          FIREBASE_CONFIG: 'invalid-json',
        },
      };

      expect(() => getClientEnv(context)).toThrow(
        'FIREBASE_CONFIG environment variable contains invalid JSON. Please ensure it is properly formatted.',
      );
    });

    it('should handle empty context object', () => {
      const context = {};

      const result = getClientEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: undefined,
        APP_NAME: 'remix-app',
      });
    });

    it('should handle undefined context', () => {
      const result = getClientEnv();

      expect(result).toEqual({
        FIREBASE_CONFIG: undefined,
        APP_NAME: 'remix-app',
      });
    });
  });

  describe('getServerEnv', () => {
    it('should return all environment variables from context environment', () => {
      const context = {
        env: {
          FIREBASE_CONFIG: mockFirebaseConfigString,
          FIREBASE_PROJECT_ID: mockProjectId,
          FIREBASE_SERVICE_ACCOUNT_KEY: 'test-service-key',
          GOOGLE_GENERATIVE_AI_API_KEY: 'test-ai-key',
          GOOGLE_GENERATIVE_AI_MODEL_NAME: 'gemini-pro',
        },
      };

      const result = getServerEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: mockFirebaseConfigString,
        FIREBASE_PROJECT_ID: mockProjectId,
        FIREBASE_SERVICE_ACCOUNT_KEY: 'test-service-key',
        GOOGLE_GENERATIVE_AI_API_KEY: 'test-ai-key',
        GOOGLE_GENERATIVE_AI_MODEL_NAME: 'gemini-pro',
      });
    });

    it('should return all environment variables from process.env', () => {
      process.env.FIREBASE_CONFIG = mockFirebaseConfigString;
      process.env.FIREBASE_PROJECT_ID = mockProjectId;
      const context = {};

      const result = getServerEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: mockFirebaseConfigString,
        FIREBASE_PROJECT_ID: mockProjectId,
        FIREBASE_SERVICE_ACCOUNT_KEY: undefined,
        GOOGLE_GENERATIVE_AI_API_KEY: undefined,
        GOOGLE_GENERATIVE_AI_MODEL_NAME: undefined,
      });
    });

    it('should prioritize context environment over process.env', () => {
      process.env.FIREBASE_CONFIG = 'wrong-config';
      process.env.FIREBASE_PROJECT_ID = 'wrong-project-id';
      const context = {
        env: {
          FIREBASE_CONFIG: mockFirebaseConfigString,
          FIREBASE_PROJECT_ID: mockProjectId,
        },
      };

      const result = getServerEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: mockFirebaseConfigString,
        FIREBASE_PROJECT_ID: mockProjectId,
        FIREBASE_SERVICE_ACCOUNT_KEY: undefined,
        GOOGLE_GENERATIVE_AI_API_KEY: undefined,
        GOOGLE_GENERATIVE_AI_MODEL_NAME: undefined,
      });
    });

    it('should return undefined when Firebase variables are missing', () => {
      const context = {
        env: {
          FIREBASE_PROJECT_ID: mockProjectId,
        },
      };

      const result = getServerEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: undefined,
        FIREBASE_PROJECT_ID: mockProjectId,
        FIREBASE_SERVICE_ACCOUNT_KEY: undefined,
        GOOGLE_GENERATIVE_AI_API_KEY: undefined,
        GOOGLE_GENERATIVE_AI_MODEL_NAME: undefined,
      });
    });

    it('should return undefined when all variables are missing', () => {
      const context = {};

      const result = getServerEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: undefined,
        FIREBASE_PROJECT_ID: undefined,
        FIREBASE_SERVICE_ACCOUNT_KEY: undefined,
        GOOGLE_GENERATIVE_AI_API_KEY: undefined,
        GOOGLE_GENERATIVE_AI_MODEL_NAME: undefined,
      });
    });

    it('should handle undefined context', () => {
      const result = getServerEnv();

      expect(result).toEqual({
        FIREBASE_CONFIG: undefined,
        FIREBASE_PROJECT_ID: undefined,
        FIREBASE_SERVICE_ACCOUNT_KEY: undefined,
        GOOGLE_GENERATIVE_AI_API_KEY: undefined,
        GOOGLE_GENERATIVE_AI_MODEL_NAME: undefined,
      });
    });

    it('should handle mixed environment sources', () => {
      process.env.FIREBASE_CONFIG = mockFirebaseConfigString;
      const context = {
        env: {
          FIREBASE_PROJECT_ID: mockProjectId,
        },
      };

      const result = getServerEnv(context);

      expect(result).toEqual({
        FIREBASE_CONFIG: mockFirebaseConfigString,
        FIREBASE_PROJECT_ID: mockProjectId,
        FIREBASE_SERVICE_ACCOUNT_KEY: undefined,
        GOOGLE_GENERATIVE_AI_API_KEY: undefined,
        GOOGLE_GENERATIVE_AI_MODEL_NAME: undefined,
      });
    });
  });

  describe('Environment variable priority', () => {
    it('should follow correct priority order for client env', () => {
      process.env.FIREBASE_CONFIG = JSON.stringify({ apiKey: 'process-env' });

      const context = {
        env: {
          FIREBASE_CONFIG: JSON.stringify({ apiKey: 'context-env' }),
        },
      };

      const result = getClientEnv(context);

      expect(result.FIREBASE_CONFIG?.apiKey).toBe('context-env');
    });

    it('should follow correct priority order for server env', () => {
      process.env.FIREBASE_CONFIG = JSON.stringify({ apiKey: 'process-env' });
      process.env.FIREBASE_PROJECT_ID = 'process-env-project';

      const context = {
        env: {
          FIREBASE_CONFIG: JSON.stringify({ apiKey: 'context-env' }),
          FIREBASE_PROJECT_ID: 'context-env-project',
        },
      };

      const result = getServerEnv(context);

      expect(
        result.FIREBASE_CONFIG
          ? JSON.parse(result.FIREBASE_CONFIG).apiKey
          : undefined,
      ).toBe('context-env');
      expect(result.FIREBASE_PROJECT_ID).toBe('context-env-project');
    });
  });
});