import { Pressable, StyleSheet, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTooltipDemo from './components/CustomTooltipDemo';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type CustomTooltipsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CustomTooltips'>;
};

export function CustomTooltipsScreen({
  navigation,
}: CustomTooltipsScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <CustomTooltipDemo />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  backIcon: {
    fontSize: 24,
    color: '#007AFF',
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
