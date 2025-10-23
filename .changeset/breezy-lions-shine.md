---
'@edwardloopez/react-native-coachmark': patch
---

Comprehensive documentation improvements and code cleanup:

**Documentation Enhancements:**
- Added detailed Auto-Scroll Features section with ScrollView/FlatList integration examples
- Documented all lifecycle hooks (onBeforeEnter, onBeforeScroll, onEnter, onExit) with use cases
- Complete theme customization reference including all properties and easing functions
- Added ScrollView integration guide with practical examples
- Added 3 comprehensive real-world examples (auto-scroll, conditional steps, custom theme)
- Updated features list to highlight auto-scroll and lifecycle hooks

**Code Improvements:**
- Added `TooltipPosition` type for better type safety in placement utilities
- Removed web-specific code from accessibility utils (iOS/Android only)
- Cleaned up all `@ts-ignore` comments and Platform.OS checks for web
- Simplified accessibility functions to focus on native platforms

**Configuration:**
- Fixed changeset config to remove non-existent monorepo package reference
