const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      '@models': path.resolve(__dirname, 'app/models'),
      '@services': path.resolve(__dirname, 'app/services'),
      '@components': path.resolve(__dirname, 'app/components'),
      '@hooks': path.resolve(__dirname, 'app/hooks'),
      '@styles': path.resolve(__dirname, 'app/styles'),
      '@types': path.resolve(__dirname, 'app/types'),
      '@utils': path.resolve(__dirname, 'app/utils'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
