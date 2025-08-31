module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['react-native-gesture-handler/jestSetup'],
  transformIgnorePatterns: [
    'node_modules/(?!(@react-native|react-native|@react-navigation|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-permissions)/)',
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
    '^react-native-permissions$':
      '<rootDir>/__mocks__/react-native-permissions.ts',
    '^react-native-maps$': '<rootDir>/__mocks__/react-native-maps.tsx',
    '^react-native-geolocation-service$':
      '<rootDir>/__mocks__/react-native-geolocation-service.ts',
  },
};
