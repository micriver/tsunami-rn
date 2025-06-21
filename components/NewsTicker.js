import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import Svg, { Defs, Pattern, Line, Rect } from "react-native-svg";
import theme from "../theme";
import { useTheme } from "../context/ThemeContext";

const { width: screenWidth } = Dimensions.get("window");

const NewsTicker = ({ isLoginScreen = false }) => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const lastOffset = useRef(0);
  const { isDarkMode } = useTheme();

  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  // Bombastic GTA-style crypto news headlines (satirical/dramatic)
  const sampleNews = [
    "BREAKING: BITCOIN MILLIONAIRE BUYS ENTIRE CITY WITH DIGITAL COINS!",
    "CRYPTO CHAOS: ETHEREUM MINERS DECLARE INDEPENDENCE FROM REALITY!",
    "DOGECOIN ARMY STORMS WALL STREET - SUITS FLEE IN TERROR!",
    "MASSIVE: SHIBA INU OWNER TRADES DOG FOR PRIVATE ISLAND!",
    "SCANDAL: BANK CEO CAUGHT HOARDING BITCOIN IN BASEMENT VAULT!",
    "EXCLUSIVE: SATOSHI NAKAMOTO SPOTTED BUYING LAMBORGHINIS WITH SPARE CHANGE!",
  ];

  useEffect(() => {
    fetchCryptoNews();
  }, []);

  const fetchCryptoNews = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from CryptoNews API (free demo)
      const response = await fetch(
        "https://cryptonews-api.com/api/v1?tickers=BTC,ETH&items=10&token=demo"
      );

      if (response.ok) {
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          // Convert normal headlines to bombastic GTA-style
          const headlines = data.data.map((item) => {
            const title = (item.title || item.headline).toUpperCase();
            return `BREAKING: ${title}`;
          });
          setNews(headlines.slice(0, 6)); // Limit to 6 headlines
          console.log("✅ Crypto news loaded successfully");
        } else {
          throw new Error("No news data received");
        }
      } else {
        throw new Error("API request failed");
      }
    } catch (error) {
      console.log(
        "⚠️ Crypto news API failed, using sample data:",
        error.message
      );
      setNews(sampleNews);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (news.length > 0) {
      startScrollAnimation();
    }
  }, [news]);

  const startScrollAnimation = () => {
    if (isDragging) return; // Don't start if dragging
    
    // Stop current animation if any
    if (currentAnimation) {
      currentAnimation.stop();
    }

    // Calculate total width needed for all news items
    const totalWidth = news.length * screenWidth;
    
    // Get current position and calculate remaining distance
    const currentValue = scrollX._value;
    const remainingDistance = -totalWidth - currentValue;
    const totalDistance = totalWidth;
    const progress = Math.abs(currentValue) / totalDistance;
    const remainingDuration = (1 - progress) * news.length * 8000;

    // Create continuous scrolling animation from current position
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -totalWidth,
        duration: Math.max(remainingDuration, 1000), // Minimum 1 second
        useNativeDriver: true,
      }),
      { iterations: -1 } // Infinite loop
    );

    setCurrentAnimation(scrollAnimation);
    scrollAnimation.start();
  };

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: scrollX } }],
    { useNativeDriver: false }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.state === State.BEGAN) {
      setIsDragging(true);
      if (currentAnimation) {
        currentAnimation.stop();
      }
      lastOffset.current = scrollX._value;
    } else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
      setIsDragging(false);
      const finalOffset = lastOffset.current + event.nativeEvent.translationX;
      scrollX.setValue(finalOffset);
      lastOffset.current = finalOffset;
      // Resume animation smoothly from current position
      startScrollAnimation();
    }
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: currentTheme.background.primary },
        ]}
      >
        <Text style={[styles.loadingText, { color: currentTheme.text.muted }]}>
          Loading news...
        </Text>
      </View>
    );
  }

  const DiagonalGridBackground = () => {
    const lineColor = isDarkMode
      ? "rgba(255, 255, 255, 0.08)"
      : "rgba(0, 0, 0, 0.06)"; // 30% less subtle
    
    const height = isLoginScreen ? 120 : 40;

    return (
      <Svg
        width={screenWidth}
        height={height}
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <Pattern
            id='diagonalGrid'
            patternUnits='userSpaceOnUse'
            width='12'
            height='12'
            patternTransform='rotate(45)'
          >
            {/* Diagonal grid lines */}
            <Line
              x1='0'
              y1='6'
              x2='12'
              y2='6'
              stroke={lineColor}
              strokeWidth='0.5'
            />
            <Line
              x1='6'
              y1='0'
              x2='6'
              y2='12'
              stroke={lineColor}
              strokeWidth='0.5'
            />
          </Pattern>
        </Defs>
        <Rect width='100%' height='100%' fill='url(#diagonalGrid)' />
      </Svg>
    );
  };

  return (
    <View
      style={[
        styles.container,
        isLoginScreen ? styles.loginContainer : styles.mainContainer,
        {
          backgroundColor: isDarkMode
            ? currentTheme.background.tertiary || "#1a1a1a"
            : "#f8f9fa", // Slightly lighter for light mode
        },
      ]}
    >
      {/* Diagonal grid background */}
      <DiagonalGridBackground />

      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
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
            {[...news, ...news].map((headline, index) => (
              <React.Fragment key={index}>
                <View style={styles.newsItem}>
                  <Text
                    style={[
                      styles.newsText,
                      {
                        color:
                          currentTheme.accent?.orange ||
                          theme.colors.accent.orange,
                      },
                    ]}
                    numberOfLines={1}
                    ellipsizeMode='tail'
                  >
                    {headline}
                  </Text>
                </View>
                {/* Add dot separator */}
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
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    overflow: "hidden",
    // Removed marginHorizontal and borderRadius for edge-to-edge
  },
  mainContainer: {
    height: 40, // Smaller for main screen
    marginBottom: theme.spacing.md,
  },
  loginContainer: {
    height: 120, // Much larger for login screen
    marginBottom: theme.spacing.lg,
  },
  loadingText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    textAlign: "center",
    fontWeight: theme.typography.weights.light,
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
  newsItem: {
    paddingHorizontal: theme.spacing.lg,
    justifyContent: "center",
    minWidth: screenWidth * 0.8,
  },
  newsText: {
    fontSize: theme.typography.sizes.body, // Larger text
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.bold,
    textAlign: "center",
    numberOfLines: 1,
    textTransform: "uppercase",
  },
  dotSeparator: {
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  dotText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
  },
});

export default NewsTicker;
