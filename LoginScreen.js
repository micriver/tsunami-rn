import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import theme from "./theme";

const { height, width } = Dimensions.get("window");

// Using the tsunami cube image
const tsunamiCube = require("./assets/logo/cube-logo.png");

export default function LoginScreen({ onLogin }) {
  return (
    <View style={styles.container}>
      <StatusBar style='dark' />

      {/* Background color matching the PNG */}
      <View style={styles.background}>
        
        {/* Top section with different background color */}
        <View style={styles.topSection} />
        
        {/* Bottom section with PNG background color */}
        <View style={styles.bottomSection} />
        
        {/* Tsunami Cube Background Image */}
        <View style={styles.imageSection}>
          <Image source={tsunamiCube} style={styles.tsunamiCube} />
        </View>

        {/* App Title - Layered on top */}
        <View style={styles.titleSection}>
          <Text style={styles.appTitle}>TSUNAMI</Text>
        </View>

        {/* Login Buttons Section - Layered on top */}
        <View style={styles.buttonSection}>
          {/* Primary Login Button */}
          <LinearGradient
            colors={theme.colors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <TouchableOpacity
              style={styles.buttonTouchable}
              onPress={() => onLogin && onLogin()}
            >
              <Text style={styles.primaryButtonText}>Login</Text>
            </TouchableOpacity>
          </LinearGradient>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F2E8", // Top section color extends to edges
  },
  background: {
    flex: 1,
    backgroundColor: "#FEF9F0", // Match PNG background color
  },
  topSection: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
    backgroundColor: "#F9F2E8",
    zIndex: 0,
  },
  bottomSection: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.3,
    backgroundColor: "#FEF9F0",
    zIndex: 0,
  },
  titleSection: {
    position: "absolute",
    top: height * 0.12,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 2,
  },
  appTitle: {
    fontSize: 52,
    fontWeight: theme.typography.weights.black,
    color: theme.colors.brand.primary,
    letterSpacing: 3,
    backgroundColor: "transparent",
    fontFamily: theme.typography.fontFamily,
  },
  imageSection: {
    position: "absolute",
    top: -height * 0.1,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tsunamiCube: {
    width: width * 1.2,
    height: width * 1.2,
    resizeMode: "contain",
  },
  buttonSection: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    zIndex: 2,
  },
  primaryButton: {
    borderRadius: 25,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#2C7D7D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonTouchable: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  primaryButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.body + 2,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  secondaryButton: {
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.accent.orange,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: theme.colors.accent.orange,
    fontSize: theme.typography.sizes.body + 2,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
  tertiaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  tertiaryButtonText: {
    color: theme.colors.brand.secondary,
    fontSize: theme.typography.sizes.body,
    opacity: 0.8,
    fontFamily: theme.typography.fontFamily,
  },
});
