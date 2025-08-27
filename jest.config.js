module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect',
    'react-native-gesture-handler/jestSetup',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context)/)',
  ],
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/app/models/$1',
    '^@services/(.*)$': '<rootDir>/app/services/$1',
    '^@components/(.*)$': '<rootDir>/app/components/$1',
    '^@hooks/(.*)$': '<rootDir>/app/hooks/$1',
    '^@styles$': '<rootDir>/app/styles/index.ts',
    '^@styles/(.*)$': '<rootDir>/app/styles/$1',
    '^@types/(.*)$': '<rootDir>/app/types/$1',
    '^@utils/(.*)$': '<rootDir>/app/utils/$1',
  },
};
