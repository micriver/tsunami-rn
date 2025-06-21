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

      {/* Top News Ticker */}
      <NewsTicker />

      {/* Main Content */}
      <View style={styles.content}>
        {/* App Title */}
        <View style={styles.titleSection}>
          <Text style={styles.appTitle}>TSUNAMI</Text>
          <Text style={styles.subtitle}>Cryptocurrency Trading Platform</Text>
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

      {/* Bottom Coin Price Ticker */}
      <CoinTicker direction="right" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary, // Middle palette color
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxxl * 2,
  },
  appTitle: {
    fontSize: theme.typography.sizes.h1 * 1.8,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.brand.primary,
    letterSpacing: 2,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium,
  },
  buttonSection: {
    width: '100%',
    maxWidth: 300,
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
