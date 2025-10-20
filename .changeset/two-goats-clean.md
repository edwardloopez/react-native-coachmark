---
'@edwardloopez/react-native-coachmark': minor
---

Add auto-focus feature for automatic scrolling to off-screen coachmark anchors

- Add autoFocus prop ('always' | 'ifNeeded') to TourStep
- Add scrollRef prop on CoachmarkAnchor for linking ScrollView/FlatList
- Implement automatic viewport detection and smooth scrolling
- Add scrollBehavior, scrollPadding, and onBeforeScroll options
- Include comprehensive tests and documentation
