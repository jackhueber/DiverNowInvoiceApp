import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/DashboardScreen';
import { MappingsScreen } from '../screens/MappingsScreen';
import { AnalyticsSummaryScreen } from '../screens/AnalyticsSummaryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/tokens';

export type MainTabParamList = {
  Dashboard: undefined;
  Associate: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primarySoft,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 4,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'ellipse-outline';

          switch (route.name) {
            case 'Dashboard':
              iconName = 'grid-outline';
              break;
            case 'Associate':
              iconName = 'link-outline';
              break;
            case 'Analytics':
              iconName = 'stats-chart-outline';
              break;
            case 'Settings':
              iconName = 'settings-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen
        name="Associate"
        component={MappingsScreen}
        options={{ title: 'Associate' }}
      />
      <Tab.Screen name="Analytics" component={AnalyticsSummaryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

