import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CryptoCurrencyList from "./CryptoCurrencyList";
import LoginScreen from "./LoginScreen";
import CoinDetailScreen from "./CoinDetailScreen";
import SettingsScreen from "./components/SettingsScreen";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "./theme";
import { ThemeProvider, useTheme } from "./context/ThemeContext";


function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();

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
    // <ImageBackground
    //   source={backgroundImage}
    //   style={styles.background}
    //   resizeMode='cover'
    // >
    <View style={styles.background}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>TSUNAMI</Text>
          </View>
          <TouchableOpacity onPress={handleOpenSettings}>
            <MaterialIcons name='account-circle' size={42} color={theme.colors.accent.orange} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.container}>
          <CryptoCurrencyList onCoinSelect={handleCoinSelect} />
          <StatusBar style='auto' />
        </View>
      </SafeAreaView>

      {/* Coin Detail Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseModal}
      >
        <CoinDetailScreen coin={selectedCoin} onClose={handleCloseModal} />
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={isSettingsVisible}
        animationType="slide"
        presentationStyle="pageSheet"
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
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
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
