module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@core': './src/core',
          '@dsl': './src/dsl',
          '@hooks': './src/hooks',
          '@ui': './src/ui',
          '@utils': './src/utils',
          '@anchors': './src/anchors',
        },
      },
    ],
  ],
  overrides: [
    {
      exclude: /\/node_modules\//,
      presets: ['module:react-native-builder-bob/babel-preset'],
    },
    {
      include: /\/node_modules\//,
      presets: ['module:@react-native/babel-preset'],
    },
  ],
};
