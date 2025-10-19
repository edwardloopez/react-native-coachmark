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
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(projectRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  'react-native-coachmark': path.resolve(monorepoRoot, 'src'),
};

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
