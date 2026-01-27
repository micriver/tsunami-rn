import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Animated,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./src/navigation/MainNavigator";
import CryptoCurrencyList from "./src/screens/CryptoCurrencyList";
import LoginScreen from "./src/screens/LoginScreen";
import CoinDetailScreen from "./src/screens/CoinDetailScreen";
import SettingsScreen from "./src/components/SettingsScreen";
import MyWatchlistScreen from "./src/screens/MyWatchlistScreen";
import NewsTicker from "./src/components/NewsTicker";
import SplashScreen from "./src/components/SplashScreen";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "./src/theme/theme";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { WatchlistProvider } from "./src/context/WatchlistContext";
import { AuthProvider, useAuth } from "./src/context/AuthContext";

function AppContent() {
  const { isLoggedIn, isLoading: isAuthLoading, login, logout } = useAuth();
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const [isWatchlistVisible, setIsWatchlistVisible] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [splashFinished, setSplashFinished] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  // Fade in main app content when splash finishes
  useEffect(() => {
    if (splashFinished) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    }
  }, [splashFinished]);

  const handleLogin = async () => {
    await login();
  };

  const handleLogout = async () => {
    await logout();
    setSelectedCoin(null);
    setIsModalVisible(false);
    setIsSettingsVisible(false);
    setIsWatchlistVisible(false);
  };

  const handleOpenSettings = () => {
    setIsSettingsVisible(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsVisible(false);
  };

  const handleOpenWatchlist = () => {
    setIsSettingsVisible(false); // Close settings if open
    setIsWatchlistVisible(true);
  };

  const handleCloseWatchlist = () => {
    setIsWatchlistVisible(false);
  };

  const handleCoinSelect = (coin) => {
    setSelectedCoin(coin);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedCoin(null);
  };

  const handleSplashFinish = () => {
    setSplashFinished(true);
  };

  // Render both screens during transition
  const mainAppContent = !isLoggedIn ? (
    <LoginScreen onLogin={handleLogin} />
  ) : (
    <Animated.View
      style={[
        styles.background,
        {
          backgroundColor: currentTheme.background.primary,
          opacity: fadeAnim,
        },
      ]}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text
              style={[
                styles.title,
                {
                  color:
                    currentTheme.brand?.primary || currentTheme.brand.primary,
                },
              ]}
            >
              TSUNAMI
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={toggleTheme} style={styles.headerIcon}>
              <MaterialIcons
                name={isDarkMode ? "light-mode" : "dark-mode"}
                size={24}
                color={
                  currentTheme.text?.secondary || theme.colors.text.secondary
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleOpenSettings}
              style={styles.headerIcon}
            >
              <MaterialIcons
                name='account-circle'
                size={32}
                color={
                  currentTheme.accent?.orange || theme.colors.accent.orange
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* News Ticker moved to NewsScreen */}

        <View style={styles.container}>
          <NavigationContainer>
            <MainNavigator onCoinSelect={handleCoinSelect} />
          </NavigationContainer>
          <StatusBar style={isDarkMode ? "light" : "dark"} />
        </View>
      </SafeAreaView>

      {/* Coin Detail Modal */}
      <Modal
        visible={isModalVisible}
        animationType='none'
        presentationStyle='overFullScreen'
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <CoinDetailScreen coin={selectedCoin} onClose={handleCloseModal} />
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={isSettingsVisible}
        animationType='none'
        presentationStyle='overFullScreen'
        transparent={true}
        onRequestClose={handleCloseSettings}
      >
        <SettingsScreen
          onClose={handleCloseSettings}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onThemeToggle={toggleTheme}
          onOpenWatchlist={handleOpenWatchlist}
        />
      </Modal>

      {/* My Watchlist Modal */}
      <Modal
        visible={isWatchlistVisible}
        animationType='slide'
        presentationStyle='pageSheet'
        onRequestClose={handleCloseWatchlist}
      >
        <MyWatchlistScreen
          onCoinSelect={(coin) => {
            handleCloseWatchlist();
            handleCoinSelect(coin);
          }}
          onClose={handleCloseWatchlist}
        />
      </Modal>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1 }}>
      {showSplash && (
        <View style={StyleSheet.absoluteFill}>
          <SplashScreen
            onFinish={handleSplashFinish}
            fadeOut={splashFinished}
          />
        </View>
      )}
      {splashFinished && (
        <View style={StyleSheet.absoluteFill}>{mainAppContent}</View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <ThemeProvider>
          <WatchlistProvider>
            <AppContent />
          </WatchlistProvider>
        </ThemeProvider>
      </AuthProvider>
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
  headerIcon: {
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
