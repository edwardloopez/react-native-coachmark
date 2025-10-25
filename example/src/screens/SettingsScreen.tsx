import { useEffect, useState } from 'react';

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Switch,
} from 'react-native';

import {
  CoachmarkAnchor,
  createTour,
  useCoachmark,
} from '@edwardloopez/react-native-coachmark';

export function SettingsScreen() {
  const { start } = useCoachmark();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    start(
      createTour(
        'settings-tour',
        [
          {
            id: 'notifications-setting',
            title: 'Notifications Setting',
            description: 'Enable or disable push notifications for the app.',
            shape: 'rect',
            radius: 12,
          },
          {
            id: 'darkmode-setting',
            title: 'Dark Mode Setting',
            description: 'Toggle between light and dark themes.',
            shape: 'rect',
            radius: 12,
          },
          {
            id: 'analytics-setting',
            title: 'Analytics Setting',
            description:
              'Opt in or out of anonymous analytics to help improve the app.',
            shape: 'rect',
            radius: 12,
          },
        ],
        { showOnce: false, delay: 800 }
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <CoachmarkAnchor
          id="notifications-setting"
          shape="rect"
          radius={12}
          style={styles.settingItem}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🔔</Text>
            <View>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDesc}>Enable push notifications</Text>
            </View>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#fff"
          />
        </CoachmarkAnchor>

        <CoachmarkAnchor
          id="darkmode-setting"
          shape="rect"
          radius={12}
          style={styles.settingItem}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>🌙</Text>
            <View>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDesc}>Switch to dark theme</Text>
            </View>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#fff"
          />
        </CoachmarkAnchor>

        <CoachmarkAnchor
          id="analytics-setting"
          shape="rect"
          radius={12}
          style={styles.settingItem}
        >
          <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>📊</Text>
            <View>
              <Text style={styles.settingTitle}>Analytics</Text>
              <Text style={styles.settingDesc}>Help improve the app</Text>
            </View>
          </View>
          <Switch
            value={analytics}
            onValueChange={setAnalytics}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#fff"
          />
        </CoachmarkAnchor>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>React Native Coachmark</Text>
          <Text style={styles.infoVersion}>Version 0.1.0</Text>
          <Text style={styles.infoDesc}>
            A powerful and flexible coachmark/tour library for React Native
            applications.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  backIcon: {
    fontSize: 24,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 44,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  settingItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 14,
    color: '#8E8E93',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  infoDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  navButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
