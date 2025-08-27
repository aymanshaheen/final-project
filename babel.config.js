module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        alias: {
          '@models': './app/models',
          '@services': './app/services',
          '@components': './app/components',
          '@hooks': './app/hooks',
          '@styles': './app/styles',
          '@types': './app/types',
          '@utils': './app/utils',
        },
      },
    ],
  ],
};
