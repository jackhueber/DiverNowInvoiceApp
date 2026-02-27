import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { CalendarScreen } from '../screens/CalendarScreen';
import { CleaningsScreen } from '../screens/CleaningsScreen';
import { MappingsScreen } from '../screens/MappingsScreen';
import { OrdersScreen } from '../screens/OrdersScreen';
import { AnalyticsSummaryScreen } from '../screens/AnalyticsSummaryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/tokens';

export type MainTabParamList = {
  Calendar: undefined;
  Cleanings: undefined;
  Mappings: undefined;
  Orders: undefined;
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
            case 'Calendar':
              iconName = 'calendar-outline';
              break;
            case 'Cleanings':
              iconName = 'water-outline';
              break;
            case 'Mappings':
              iconName = 'link-outline';
              break;
            case 'Orders':
              iconName = 'cart-outline';
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
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Cleanings" component={CleaningsScreen} />
      <Tab.Screen name="Mappings" component={MappingsScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsSummaryScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

