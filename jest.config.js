module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        useESM: true,
      },
    ],
  },
  // ⬇️ CRÍTICO: Transformar módulos ESM de Angular
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@angular|@fullcalendar|preact|rxjs)/.*)'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
    // Mocks para FullCalendar
    '^@fullcalendar/angular$': '<rootDir>/src/__mocks__/@fullcalendar/angular.ts',
    '^@fullcalendar/core$': '<rootDir>/src/__mocks__/@fullcalendar/core.ts',
    '^@fullcalendar/daygrid$': '<rootDir>/src/__mocks__/@fullcalendar/daygrid.ts',
    '^@fullcalendar/timegrid$': '<rootDir>/src/__mocks__/@fullcalendar/timegrid.ts',
    '^@fullcalendar/interaction$': '<rootDir>/src/__mocks__/@fullcalendar/interaction.ts',
  },
  // Configuración ESM
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/services/**/*.ts',
    '!src/services/**/*.spec.ts',
  ],
  testPathPattern: 'services',
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'text', 'html', 'lcov'],
  // Velocidad y rendimiento
  maxWorkers: 2,
  verbose: false,
};