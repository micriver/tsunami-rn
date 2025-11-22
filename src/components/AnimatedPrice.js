import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, StyleSheet, Easing } from "react-native";
import theme from "../theme/theme";
import { useTheme } from "../context/ThemeContext";

const AnimatedPrice = ({
  price,
  previousPrice,
  style,
  formatPrice = true,
  ...textProps
}) => {
  const { isDarkMode } = useTheme();
  const flashAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (
      previousPrice &&
      price !== previousPrice &&
      typeof price === "number" &&
      typeof previousPrice === "number"
    ) {
      const isIncrease = price > previousPrice;

      // Enhanced flash animation with glow effect
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 800,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]).start();

      // Subtle scale animation with smooth easing
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: isIncrease ? 1.08 : 1.06,
          duration: 120,
          easing: Easing.out(Easing.back(1.5)),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Fade in/out animation for subtle emphasis
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.7,
          duration: 100,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();

      // Glow effect for significant changes
      const priceChangePercent = Math.abs(
        (price - previousPrice) / previousPrice
      );
      if (priceChangePercent > 0.01) {
        // Only glow for changes > 1%
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: false,
          }),
        ]).start();
      }
    }
  }, [price, previousPrice]);

  const baseColor = style?.color || (isDarkMode ? "#ffffff" : "#000000"); // Use the provided color or theme-based default
  const flashColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      baseColor,
      previousPrice &&
      typeof price === "number" &&
      typeof previousPrice === "number"
        ? price > previousPrice
          ? theme.colors.indicators.positive
          : theme.colors.indicators.negative
        : baseColor,
    ],
  });

  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      "rgba(0, 0, 0, 0)",
      previousPrice &&
      typeof price === "number" &&
      typeof previousPrice === "number"
        ? price > previousPrice
          ? "rgba(34, 197, 94, 0.3)" // Green glow
          : "rgba(239, 68, 68, 0.3)" // Red glow
        : "rgba(0, 0, 0, 0)",
    ],
  });

  const displayValue = formatPrice
    ? typeof price === "number"
      ? `$${price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : price
    : price;

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        opacity: opacityAnim,
        shadowColor: glowColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: glowAnim,
        shadowRadius: 8,
        elevation: 0,
      }}
    >
      <Animated.Text
        style={[
          style,
          {
            color: flashColor,
            textShadowColor: glowColor,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 4,
          },
        ]}
        {...textProps}
      >
        {displayValue}
      </Animated.Text>
    </Animated.View>
  );
};

export default AnimatedPrice;
