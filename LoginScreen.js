import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import theme from "./theme";
import NewsTicker from "./components/NewsTicker";
import CoinTicker from "./components/CoinTicker";

const { height, width } = Dimensions.get("window");

export default function LoginScreen({ onLogin }) {
  return (
    <View style={styles.container}>
      <StatusBar style='auto' />

      {/* App Title */}
      <View style={styles.titleSection}>
        <Text style={styles.appTitle}>TSUNAMI</Text>
      </View>

      {/* News Tickers */}
      <View style={styles.tickerSection}>
        <NewsTicker />
        <CoinTicker direction="right" />
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
    backgroundColor: theme.colors.background.secondary, // Middle palette color
  },
  titleSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  appTitle: {
    fontSize: 64, // Large fixed size to prevent wrapping
    fontWeight: theme.typography.weights.black,
    color: theme.colors.brand.primary,
    letterSpacing: 4,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    width: '100%',
  },
  tickerSection: {
    marginTop: theme.spacing.xl,
    height: 80, // Same height as title roughly
  },
  buttonSection: {
    position: 'absolute',
    bottom: theme.spacing.xxxl,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  primaryButtonText: {
    color: '#ffffff',
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
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    backgroundColor: 'transparent',
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
    alignItems: 'center',
  },
  tertiaryButtonText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium,
  },
});
