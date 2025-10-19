import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CoachmarkProvider, CoachmarkOverlay } from 'react-native-coachmark';
import { HomeScreen } from './screens/HomeScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { CustomTooltipsScreen } from './screens/CustomTooltipsScreen';
import type { RootStackParamList } from './navigation/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <CoachmarkProvider
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
        }}
      >
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="CustomTooltips"
              component={CustomTooltipsScreen}
            />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
          <CoachmarkOverlay />
        </NavigationContainer>
      </CoachmarkProvider>
    </SafeAreaProvider>
  );
}
