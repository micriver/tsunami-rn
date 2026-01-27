import React, { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Dimensions, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import Svg, { Path } from "react-native-svg";
import theme from "../theme/theme";
import { useTheme } from "../context/ThemeContext";

const { width, height } = Dimensions.get("window");

// Wave configuration for multiple layers
const WAVE_CONFIGS = [
  { amplitude: 25, frequency: 0.008, speed: 0.02, opacity: 0.15, yOffset: 0 },
  { amplitude: 20, frequency: 0.012, speed: 0.025, opacity: 0.2, yOffset: 15 },
  { amplitude: 30, frequency: 0.006, speed: 0.015, opacity: 0.12, yOffset: -10 },
  { amplitude: 18, frequency: 0.01, speed: 0.03, opacity: 0.25, yOffset: 25 },
];

// Generate smooth sine wave path with many points
const generateWavePath = (phase, config, screenWidth, waveHeight) => {
  const { amplitude, frequency, yOffset } = config;
  const points = [];
  const numPoints = 100; // More points for smoother curves

  // Start from bottom left
  points.push(`M 0 ${waveHeight + 100}`);

  // Generate wave points
  for (let i = 0; i <= numPoints; i++) {
    const x = (i / numPoints) * (screenWidth + 100);
    const y =
      waveHeight +
      yOffset +
      Math.sin((x + phase) * frequency * Math.PI * 2) * amplitude +
      Math.sin((x + phase) * frequency * 0.5 * Math.PI * 2) * (amplitude * 0.3);
    points.push(`L ${x} ${y}`);
  }

  // Close the path at bottom right, then bottom left
  points.push(`L ${screenWidth + 100} ${waveHeight + 100}`);
  points.push(`L 0 ${waveHeight + 100}`);
  points.push("Z");

  return points.join(" ");
};

export default function SplashScreen({ onFinish, fadeOut }) {
  const { isDarkMode } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const containerFadeAnim = useRef(new Animated.Value(1)).current;
  const waveOpacityAnim = useRef(new Animated.Value(0)).current;

  // Phase values for each wave layer
  const [wavePhases, setWavePhases] = useState(
    WAVE_CONFIGS.map((_, index) => index * 100)
  );

  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  const waveColor = currentTheme.brand?.primary || theme.colors.brand.primary;

  // Animation loop for wave movement
  useEffect(() => {
    let animationFrame;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      setWavePhases((prevPhases) =>
        prevPhases.map((phase, index) => {
          // Move waves from right to left (negative direction)
          return phase - WAVE_CONFIGS[index].speed * delta;
        })
      );

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  useEffect(() => {
    // Fade in waves
    Animated.timing(waveOpacityAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

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

  // Calculate wave base position (bottom third of screen)
  const waveBaseY = height * 0.65;

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

      {/* Wave layers */}
      <Animated.View style={[styles.wavesContainer, { opacity: waveOpacityAnim }]}>
        <Svg width={width + 100} height={height} style={styles.svg}>
          {WAVE_CONFIGS.map((config, index) => (
            <Path
              key={index}
              d={generateWavePath(wavePhases[index], config, width, waveBaseY)}
              fill={waveColor}
              opacity={config.opacity}
            />
          ))}
        </Svg>
      </Animated.View>

      {/* Title */}
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
  wavesContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
    overflow: "hidden",
  },
  svg: {
    position: "absolute",
    left: -50, // Offset to hide edge artifacts
  },
  title: {
    fontWeight: theme.typography.weights.black,
    fontSize: theme.typography.sizes.h1 * 1.5,
    fontFamily: theme.typography.fontFamily,
    zIndex: 1,
  },
});
