module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterFramework: ['jest-preset-angular/setup-jest'],  // ← el del preset
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],   
  restoreMocks: true,
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
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$|@angular|@fullcalendar|preact|rxjs)/.*)'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '^app/(.*)$': '<rootDir>/src/app/$1',
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'mjs'],
  testEnvironment: 'jsdom',
  testPathPatterns: ['src'],
  maxWorkers: 2,
  verbose: true,
};