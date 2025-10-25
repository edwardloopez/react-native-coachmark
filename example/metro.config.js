const path = require('path');

const { getDefaultConfig } = require('@expo/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

/**
 * Metro configuration for pnpm monorepo
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Resolve the library directly from source for live development
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@edwardloopez/react-native-coachmark') {
    return {
      filePath: path.resolve(monorepoRoot, 'src/index.tsx'),
      type: 'sourceFile',
    };
  }
  // Use default resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
