import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  // Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import theme from "../theme/theme";
import NewsTicker from "../components/NewsTicker";
import CoinTicker from "../components/CoinTicker";
import { useTheme } from "../context/ThemeContext";

const { height, width } = Dimensions.get("window");

export default function LoginScreen({ onLogin }) {
  const { isDarkMode } = useTheme();

  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? currentTheme.background.primary
            : theme.colors.background.primary,
        },
      ]}
    >
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      {/* <Image 
        source={require('../../assets/wave_background.png')} 
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      /> */}
      {/* App Title */}
      <View style={styles.titleSection}>
        <Text
          style={[
            styles.appTitle,
            {
              color: currentTheme.brand?.primary || currentTheme.brand.primary,
            },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit={true}
          minimumFontScale={0.7}
        >
          TSUNAMI
        </Text>
      </View>

      {/* News Tickers */}
      <View style={styles.tickerSection}>
        <NewsTicker isLoginScreen={true} />
        <CoinTicker direction='right' isLoginScreen={true} />
      </View>

      {/* Login Buttons Section */}
      <View style={styles.buttonSection}>
        {/* Primary Login Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => onLogin && onLogin()}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        {/* Secondary Sign Up Button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => console.log("Sign up pressed")}
        >
          <Text style={styles.secondaryButtonText}>Create Account</Text>
        </TouchableOpacity>

        {/* Tertiary Guest Access Button */}
        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => onLogin && onLogin()}
        >
          <Text style={styles.tertiaryButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleSection: {
    alignItems: "center",
    paddingTop: height * 0.15, // Use percentage of screen height for better centering
    paddingHorizontal: theme.spacing.xl,
  },
  appTitle: {
    fontSize: 56, // Larger title
    fontWeight: theme.typography.weights.black,
    color: theme.colors.brand.primary, // Use original brand color
    letterSpacing: 4,
    fontFamily: theme.typography.fontFamily,
    textAlign: "center",
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.7,
  },
  tickerSection: {
    flex: 1, // Take up all space between title and buttons
    marginTop: height * 0.04, // Much less margin after title to move tickers up
    marginBottom: theme.spacing.xxxl, // Back to original button spacing
    justifyContent: "flex-start", // Align tickers to top of their section
    paddingTop: theme.spacing.sm, // Small padding to move them up
  },
  buttonSection: {
    position: "absolute",
    bottom: theme.spacing.xxxl,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: theme.colors.accent.orange,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
  secondaryButton: {
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.accent.orange,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    backgroundColor: "transparent",
  },
  secondaryButtonText: {
    color: theme.colors.accent.orange,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
  tertiaryButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
  },
  tertiaryButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium,
  },
});
