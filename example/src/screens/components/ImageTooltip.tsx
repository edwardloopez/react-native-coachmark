import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { TooltipRenderProps } from '@edwardloopez/react-native-coachmark';

export const ImageTooltip = ({
  title,
  description,
  imageUri,
  onNext,
  onSkip,
  isLast,
}: TooltipRenderProps & { imageUri?: string }): React.ReactElement => {
  return (
    <View style={[styles.container, styles.image]}>
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.tooltipImage} />
      )}
      <View style={styles.imageContent}>
        <Text style={styles.imageTitle}>{title}</Text>
        <Text style={styles.imageDesc}>{description}</Text>
        <View style={styles.imageActions}>
          <Pressable onPress={onSkip}>
            <Text style={styles.skipText}>Skip Tour</Text>
          </Pressable>
          <Pressable onPress={onNext} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>
              {isLast ? 'Done' : 'Next'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 320,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  image: {
    overflow: 'hidden',
  },
  tooltipImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  imageContent: {
    padding: 20,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  imageDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skipText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
  },
  imageButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  imageButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
