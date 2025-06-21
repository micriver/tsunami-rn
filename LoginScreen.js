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
        <Text 
          style={styles.appTitle}
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
        <CoinTicker direction="right" isLoginScreen={true} />
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
    backgroundColor: '#0f172a', // Dark navy to distinguish from main app
  },
  titleSection: {
    alignItems: 'center',
    paddingTop: theme.spacing.xxxl * 2,
    paddingHorizontal: theme.spacing.xl,
  },
  appTitle: {
    fontSize: 48, // Reduced to ensure single line
    fontWeight: theme.typography.weights.black,
    color: theme.colors.brand.primary,
    letterSpacing: 3,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    numberOfLines: 1,
    adjustsFontSizeToFit: true,
    minimumFontScale: 0.8,
  },
  tickerSection: {
    flex: 1, // Take up all space between title and buttons
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    justifyContent: 'center',
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
