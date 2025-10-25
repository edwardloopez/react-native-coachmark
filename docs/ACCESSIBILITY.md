# Accessibility

React Native Coachmark is built with accessibility in mind from the start.

## ♿️ Built-In Features

### Screen Reader Support

The library automatically announces tour information to users with screen readers:

- **Tour started** - Announced when tour begins
- **Step information** - Announces current step number and total steps
- **Step content** - Title and description read aloud
- **Navigation buttons** - "Next", "Back", "Skip" buttons are fully accessible

```tsx
// Your tour automatically announces this
{
  id: 'feature',
  title: 'Awesome Feature',
  description: 'This is how to use it',
}

// Screen reader announces:
// "Awesome Feature. This is how to use it. Step 2 of 5."
```

### Reduced Motion Support

Users with motion sensitivity or accessibility preferences can disable animations:

```tsx
// On devices with "Reduce Motion" enabled:
// - Animations are automatically disabled
// - Spotlight transitions instantly
// - Tooltips appear without fade-in
```

Your app respects system accessibility settings automatically - **no configuration needed!**

## Keyboard Navigation

All interactive elements are fully keyboard accessible:

```
Tab          → Navigate between buttons
Enter/Space  → Activate buttons
Escape       → Skip/close tour (depends on implementation)
```

## Best Practices

### 1. Use Meaningful IDs

```tsx
// ❌ Bad
<CoachmarkAnchor id="btn-1">

// ✅ Good
<CoachmarkAnchor id="create-post-button">
```

### 2. Always Include Titles and Descriptions

```tsx
// ❌ Bad - Missing content
{
  id: 'feature',
  // No title or description
}

// ✅ Good
{
  id: 'feature',
  title: 'Create New Post',
  description: 'Click here to write and share a new post with your followers',
}
```

### 3. Use Clear, Concise Language

```tsx
// ❌ Bad - Vague
description: 'This is an important button'

// ✅ Good - Descriptive
description: 'Tap to save your changes and return to the previous screen'
```

### 4. Test with Screen Readers

- **iOS**: Enable VoiceOver (Settings → Accessibility → VoiceOver)
- **Android**: Enable TalkBack (Settings → Accessibility → TalkBack)

Navigate your tour using only a screen reader to verify the experience.

### 5. Consider Cognitive Load

```tsx
// ❌ Bad - Too many long steps
steps: [
  { id: 'step-1', description: 'Lorem ipsum dolor sit amet consectetur...' },
  { id: 'step-2', description: 'Very long explanation of a feature...' },
]

// ✅ Good - Clear, concise
steps: [
  { id: 'step-1', description: 'Create a new post here' },
  { id: 'step-2', description: 'Share your post with followers' },
]
```

## Semantic HTML / Components

The library uses semantic React Native components:

- ✅ Buttons have `accessibilityRole="button"`
- ✅ Text has `accessibilityRole="text"`
- ✅ Interactive elements are properly focusable
- ✅ Touch targets meet minimum sizing guidelines (44x44pt)

## Custom Tooltips and Accessibility

If you create custom tooltips, ensure they're accessible:

```tsx
function CustomTooltip({ title, description, index, count, onNext, onSkip }) {
  return (
    <View
      accessible={true}
      accessibilityRole="alert"  // Announces when appears
      accessibilityLabel={`${title}. ${description}. Step ${index + 1} of ${count}`}
    >
      <Text accessibilityRole="header">{title}</Text>
      <Text>{description}</Text>

      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Skip tour"
        onPress={onSkip}
      >
        <Text>Skip</Text>
      </TouchableOpacity>

      <TouchableOpacity
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Next step, step ${index + 2} of ${count}`}
        onPress={onNext}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </View>
  );
}
```

## Resources

- [React Native Accessibility Guide](https://reactnative.dev/docs/accessibility)
- [Apple VoiceOver Documentation](https://www.apple.com/accessibility/voiceover/)
- [Android TalkBack Documentation](https://support.google.com/accessibility/android/answer/6283677)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
