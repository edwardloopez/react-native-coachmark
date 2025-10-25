---
'@edwardloopez/react-native-coachmark': patch
---

## Documentation and Configuration Improvements

- **Documentation**: Reorganized README into modular structure with dedicated docs folder (ADVANCED_USAGE.md, EXAMPLES.md, ACCESSIBILITY.md, BEST_PRACTICES.md)
- **API Reference**: Converted props and options to table format for better readability
- **Web Support**: Fixed `findNodeHandle` and ScrollView compatibility issues on web platform
- **Import Organization**: Added ESLint import ordering with React/React Native prioritization
- **Path Aliases**: Configured TypeScript and Babel path aliases (@core, @ui, @utils, @anchors) for cleaner imports
- **Build Configuration**: Added `cardStyle: { flex: 1 }` to Stack Navigator for proper web layout
- **Git Hooks**: Enhanced lefthook to auto-fix ESLint issues on pre-commit
