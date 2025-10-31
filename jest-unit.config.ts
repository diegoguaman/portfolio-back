import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Solo ejecutar tests unitarios (excluir integration)
  testMatch: ['**/*.spec.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '.integration.spec.ts$', // Excluir tests de integración
  ],
  collectCoverage: true,
  coverageDirectory: 'coverage',
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
};

export default config;
