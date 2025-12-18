import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import CryptoCurrencyList from '../screens/CryptoCurrencyList';
import NewsScreen from '../screens/NewsScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

const Tab = createMaterialTopTabNavigator();

export default function MainNavigator({ onCoinSelect }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const getIcon = (routeName, focused, color) => {
    let iconName;
    switch (routeName) {
      case 'Markets':
        iconName = focused ? 'trending-up' : 'trending-up-outline';
        break;
      case 'News':
        iconName = focused ? 'newspaper' : 'newspaper-outline';
        break;
      case 'Portfolio':
        iconName = focused ? 'pie-chart' : 'pie-chart-outline';
        break;
      case 'Watchlist':
        iconName = focused ? 'star' : 'star-outline';
        break;
      default:
        iconName = 'ellipse';
    }
    return <Ionicons name={iconName} size={22} color={color} />;
  };

  return (
    <Tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        swipeEnabled: true,
        tabBarShowIcon: true,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color }) => getIcon(route.name, focused, color),
        tabBarActiveTintColor: currentTheme.brand?.primary || theme.colors.brand.primary,
        tabBarInactiveTintColor: currentTheme.text.secondary,
        tabBarStyle: {
          backgroundColor: currentTheme.background.primary,
          borderTopWidth: 1,
          borderTopColor: currentTheme.background.tertiary,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.small,
          fontWeight: theme.typography.weights.medium,
          textTransform: 'none',
          marginTop: 2,
        },
        tabBarIndicatorStyle: {
          backgroundColor: currentTheme.brand?.primary || theme.colors.brand.primary,
          height: 3,
          borderRadius: 1.5,
          position: 'absolute',
          top: 0,
        },
        tabBarPressColor: 'transparent',
      })}
    >
      <Tab.Screen name="Markets">
        {props => <CryptoCurrencyList {...props} onCoinSelect={onCoinSelect} />}
      </Tab.Screen>
      <Tab.Screen name="News" component={NewsScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Watchlist">
        {props => <WatchlistScreen {...props} onCoinSelect={onCoinSelect} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
