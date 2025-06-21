import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import theme from "../theme";
import { useTheme } from "../context/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

const CoinTicker = ({ direction = "left", isLoginScreen = false }) => {
  const scrollX = useRef(
    new Animated.Value(direction === "right" ? -screenWidth * 2 : 0)
  ).current;
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  // Top 10 crypto coins with mock price data
  const coinData = [
    { symbol: "BTC", price: 43250, change: 2.5 },
    { symbol: "ETH", price: 2650, change: -1.2 },
    { symbol: "BNB", price: 315, change: 4.1 },
    { symbol: "XRP", price: 0.62, change: -3.7 },
    { symbol: "ADA", price: 0.48, change: 6.2 },
    { symbol: "DOGE", price: 0.08, change: -0.8 },
    { symbol: "SOL", price: 98, change: 8.4 },
    { symbol: "MATIC", price: 0.89, change: -2.1 },
    { symbol: "DOT", price: 7.45, change: 3.2 },
    { symbol: "AVAX", price: 36.75, change: -1.8 },
  ];

  useEffect(() => {
    // Delay initial animation slightly to ensure proper mounting
    const timer = setTimeout(() => {
      startScrollAnimation();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const startScrollAnimation = () => {
    if (currentAnimation) {
      currentAnimation.stop();
    }

    const singleSetWidth = coinData.length * screenWidth * 0.6; // Width of one set of coins

    // Simple animation logic
    if (direction === "left") {
      const scrollAnimation = Animated.loop(
        Animated.timing(scrollX, {
          toValue: -singleSetWidth, // Only animate one set width
          duration: coinData.length * 6000, // Slower for better visibility
          useNativeDriver: true,
        }),
        { iterations: -1 }
      );

      setCurrentAnimation(scrollAnimation);
      scrollAnimation.start();
    } else {
      // Right direction - start from negative position to show content immediately
      const scrollAnimation = Animated.loop(
        Animated.timing(scrollX, {
          toValue: 0, // Animate from negative start position to 0
          duration: coinData.length * 4000, // Slower for better visibility
          useNativeDriver: true,
        }),
        { iterations: -1 }
      );

      setCurrentAnimation(scrollAnimation);
      scrollAnimation.start();
    }
  };

  const formatPrice = (price) => {
    return price < 1 ? `$${price.toFixed(4)}` : `$${price.toLocaleString()}`;
  };

  return (
    <View
      style={[
        styles.container,
        isLoginScreen ? styles.loginContainer : styles.mainContainer,
        { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)' }
      ]}
    >
      <Animated.View style={styles.tickerContainer}>
        <Animated.View
          style={[
            styles.scrollingContent,
            {
              transform: [{ translateX: scrollX }],
            },
          ]}
        >
          {[
            ...coinData,
            ...coinData,
            ...coinData,
            ...coinData,
            ...coinData,
          ].map((coin, index) => (
            <React.Fragment key={index}>
              <View style={styles.coinItem}>
                <Text
                  style={[
                    styles.coinSymbol,
                    { color: currentTheme.text.primary },
                  ]}
                >
                  {coin.symbol}
                </Text>
                <Text
                  style={[
                    styles.coinPrice,
                    { color: currentTheme.text.secondary },
                  ]}
                >
                  {formatPrice(coin.price)}
                </Text>
                <Text
                  style={[
                    styles.coinChange,
                    {
                      color:
                        coin.change >= 0
                          ? theme.colors.indicators.positive
                          : theme.colors.indicators.negative,
                    },
                  ]}
                >
                  {coin.change >= 0 ? "+" : ""}
                  {coin.change.toFixed(1)}%
                </Text>
              </View>
              <View style={styles.dotSeparator}>
                <Text
                  style={[styles.dotText, { color: currentTheme.text.muted }]}
                >
                  •
                </Text>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    overflow: "hidden",
  },
  mainContainer: {
    height: 40, // Smaller for main screen
  },
  loginContainer: {
    height: 150, // Even larger for login screen - match NewsTicker
  },
  tickerContainer: {
    flex: 1,
    overflow: "hidden",
  },
  scrollingContent: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  coinItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    minWidth: screenWidth * 0.6,
    justifyContent: "center",
  },
  coinSymbol: {
    fontSize: theme.typography.sizes.h3, // Larger for login screen - match NewsTicker
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.bold, // Match NewsTicker
    textTransform: "uppercase",
    textAlign: "center",
  },
  coinPrice: {
    fontSize: theme.typography.sizes.h3, // Larger for login screen - match NewsTicker
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.bold, // Match NewsTicker
    textAlign: "center",
  },
  coinChange: {
    fontSize: theme.typography.sizes.h3, // Larger for login screen - match NewsTicker
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.bold, // Match NewsTicker
    textAlign: "center",
  },
  dotSeparator: {
    justifyContent: "center",
    paddingHorizontal: theme.spacing.md,
  },
  dotText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
  },
});

export default CoinTicker;
