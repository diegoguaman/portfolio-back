import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Solo ejecutar tests de integración
  testMatch: ['**/*.integration.spec.ts'],
  collectCoverage: false, // No necesitamos coverage para integración
  transform: {
    '^.+\\.(t|j)s$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        diagnostics: true,
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!uuid)/'],
  testTimeout: 30000, // 30 segundos para tests de integración
};

export default config;
