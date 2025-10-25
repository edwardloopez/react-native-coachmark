---
'@edwardloopez/react-native-coachmark': patch
---

Fix broken npm package by removing path aliases from source code.

**Breaking Issue Fixed:**
- Version 0.4.4 was broken due to unresolved path aliases (`@core`, `@ui`, `@utils`, etc.) in the published package
- Metro bundler couldn't resolve these aliases in consuming projects, causing "Unable to resolve module" errors

**Changes:**
- Replaced all path alias imports with relative imports throughout the codebase
- Removed `babel-plugin-module-resolver` and `eslint-import-resolver-babel-module` dependencies
- Cleaned up path alias configuration from `tsconfig.json`, `babel.config.js`, and `eslint.config.mjs`
- Verified compiled output (`lib/`) now contains only relative imports

**Impact:**
- Package now works correctly in all React Native projects (Expo, bare workflow, Snack)
- No breaking changes for consumers - the public API remains identical
- Source code maintainability: Uses standard relative imports (industry best practice for published libraries)

