import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import theme from "../theme/theme";
import { useTheme } from "../context/ThemeContext";

export default function SplashScreen({ onFinish, fadeOut }) {
  const { isDarkMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const containerFadeAnim = useRef(new Animated.Value(1)).current;

  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Wait a bit before transitioning to main app
      setTimeout(() => {
        onFinish();
      }, 500);
    });
  }, []);

  // Fade out when fadeOut prop is true
  useEffect(() => {
    if (fadeOut) {
      Animated.timing(containerFadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeOut]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: currentTheme.background.primary,
          opacity: containerFadeAnim,
        },
      ]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <Animated.Text
        style={[
          styles.title,
          {
            color: currentTheme.brand?.primary || currentTheme.brand.primary,
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        TSUNAMI
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.primary,
  },
  title: {
    fontWeight: theme.typography.weights.black,
    fontSize: theme.typography.sizes.h1 * 1.5,
    fontFamily: theme.typography.fontFamily,
  },
});
