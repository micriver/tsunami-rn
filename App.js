import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from '@react-navigation/native';
import MainNavigator from "./src/navigation/MainNavigator";
import CryptoCurrencyList from "./src/screens/CryptoCurrencyList";
import LoginScreen from "./src/screens/LoginScreen";
import CoinDetailScreen from "./src/screens/CoinDetailScreen";
import SettingsScreen from "./src/components/SettingsScreen";
import NewsTicker from "./src/components/NewsTicker";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "./src/theme/theme";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";


function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  
  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedCoin(null);
    setIsModalVisible(false);
    setIsSettingsVisible(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsVisible(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCoin(null);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <View style={[styles.background, { backgroundColor: currentTheme.background.primary }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: currentTheme.brand?.primary || currentTheme.brand.primary }]}>TSUNAMI</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <MaterialIcons 
                name={isDarkMode ? 'light-mode' : 'dark-mode'} 
                size={28} 
                color={currentTheme.text?.secondary || theme.colors.text.secondary} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenSettings}>
              <MaterialIcons name='account-circle' size={42} color={currentTheme.accent?.orange || theme.colors.accent.orange} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* News Ticker moved to NewsScreen */}
        
        <View style={styles.container}>
          <NavigationContainer>
            <MainNavigator onCoinSelect={handleCoinSelect} />
          </NavigationContainer>
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />
        </View>
        
      </SafeAreaView>

      {/* Coin Detail Modal */}
      <Modal
        visible={isModalVisible}
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <CoinDetailScreen coin={selectedCoin} onClose={handleCloseModal} />
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={isSettingsVisible}
        animationType="none"
        presentationStyle="overFullScreen"
        transparent={true}
        onRequestClose={handleCloseSettings}
      >
        <SettingsScreen 
          onClose={handleCloseSettings}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
        />
      </Modal>
    </View>
    // </ImageBackground>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  themeToggle: {
    padding: theme.spacing.xs,
  },
  background: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    color: theme.colors.brand.primary,
    fontWeight: theme.typography.weights.black,
    fontSize: theme.typography.sizes.h1,
    fontFamily: theme.typography.fontFamily,
  },
  container: {
    flex: 1,
  },
});
