import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../hooks/useTheme';
import { HomeScreen } from '../screens/home/HomeScreen';
import { TaskStackRoutes } from './TaskStackRoutes';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { TabParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ icon, focused, color }: { icon: string; focused: boolean; color: string }) {
  return <Text style={{ fontSize: focused ? 22 : 20, opacity: focused ? 1 : 0.6 }}>{icon}</Text>;
}

export function TabRoutes() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.subtext,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ focused, color }) => <TabIcon icon="🏠" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskStackRoutes}
        options={{
          tabBarLabel: 'Tarefas',
          tabBarIcon: ({ focused, color }) => <TabIcon icon="✅" focused={focused} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Configurações',
          tabBarIcon: ({ focused, color }) => <TabIcon icon="⚙️" focused={focused} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
