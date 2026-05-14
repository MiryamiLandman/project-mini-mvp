module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/'],
  testMatch: ['**/tests/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'services/**/*.ts',
    'controllers/**/*.ts',
    'models/**/*.ts',
    'middleware/**/*.ts',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        isolatedModules: true
      }
    }]
  }
};
