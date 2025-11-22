import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CryptoCurrencyList from '../screens/CryptoCurrencyList';
import MarketsScreen from '../screens/MarketsScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import NewsScreen from '../screens/NewsScreen';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

const Tab = createMaterialTopTabNavigator();

export default function MainNavigator({ onCoinSelect }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: currentTheme.background.primary,
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          borderBottomWidth: 1,
          borderBottomColor: currentTheme.background.tertiary,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.weights.bold,
          fontSize: theme.typography.sizes.small,
          textTransform: 'uppercase',
        },
        tabBarActiveTintColor: currentTheme.brand?.primary || theme.colors.brand.primary,
        tabBarInactiveTintColor: currentTheme.text.secondary,
        tabBarIndicatorStyle: {
          backgroundColor: currentTheme.brand?.primary || theme.colors.brand.primary,
          height: 3,
          borderRadius: 1.5,
        },
        swipeEnabled: true,
      }}
    >
      <Tab.Screen 
        name="Markets" 
        component={MarketsScreen}
        options={{ tabBarLabel: 'Markets' }}
      />
      <Tab.Screen 
        name="Watchlist" 
        options={{ tabBarLabel: 'Watchlist' }}
      >
        {props => <CryptoCurrencyList {...props} onCoinSelect={onCoinSelect} />}
      </Tab.Screen>
      <Tab.Screen 
        name="News" 
        component={NewsScreen} 
        options={{ tabBarLabel: 'News' }}
      />
    </Tab.Navigator>
  );
}
