import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';

type HeaderProps = {
  title: string;
  showBackButton?: boolean;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Header({ title, showBackButton = true }: HeaderProps) {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      {showBackButton && navigation.canGoBack() && (
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backText}>←</Text>
        </Pressable>
      )}
      <Text style={styles.title}>{title}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
  },
  backText: {
    fontSize: 30,
    color: '#007AFF',
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    bottom: 10,
    zIndex: 10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});
