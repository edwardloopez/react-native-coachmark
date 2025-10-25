import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  CoachmarkProvider,
  CoachmarkOverlay,
  mmkvStorage,
} from '@edwardloopez/react-native-coachmark';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { CustomTooltipsScreen } from './screens/CustomTooltipsScreen';
import type { RootStackParamList } from './navigation/types';
import Header from './screens/components/Header';
import { storage } from './utils/const';

const Stack = createStackNavigator<RootStackParamList>();

function CustomTooltipsHeader() {
  return <Header title="Custom Tooltips" />;
}

function SettingsHeader() {
  return <Header title="Settings" />;
}

export default function App() {
  return (
    <SafeAreaProvider>
      <CoachmarkProvider
        storage={mmkvStorage(storage)}
        theme={{
          backdropOpacity: 0.7,
          tooltip: {
            maxWidth: 300,
            radius: 14,
            bg: '#FFFFFF',
            fg: '#1a1a1a',
            arrowSize: 10,
            padding: 14,
            buttonPrimaryBg: '#007AFF',
            buttonSecondaryBg: '#8E8E93',
          },
          motion: { durationMs: 300, easing: (t) => t * t },
        }}
      >
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyle: { flex: 1 },
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="CustomTooltips"
              component={CustomTooltipsScreen}
              options={{
                headerShown: true,
                header: CustomTooltipsHeader,
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                header: SettingsHeader,
              }}
            />
          </Stack.Navigator>
          <CoachmarkOverlay />
        </NavigationContainer>
      </CoachmarkProvider>
    </SafeAreaProvider>
  );
}
