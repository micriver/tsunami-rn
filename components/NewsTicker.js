import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Svg, { Defs, Pattern, Circle as SvgCircle, Rect } from 'react-native-svg';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const NewsTicker = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
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
    "EXCLUSIVE: SATOSHI NAKAMOTO SPOTTED BUYING LAMBORGHINIS WITH SPARE CHANGE!"
  ];

  useEffect(() => {
    fetchCryptoNews();
  }, []);

  const fetchCryptoNews = async () => {
    try {
      setIsLoading(true);
      // Try to fetch from CryptoNews API (free demo)
      const response = await fetch('https://cryptonews-api.com/api/v1?tickers=BTC,ETH&items=10&token=demo');
      
      if (response.ok) {
        const data = await response.json();
        if (data && data.data && data.data.length > 0) {
          // Convert normal headlines to bombastic GTA-style
          const headlines = data.data.map(item => {
            const title = (item.title || item.headline).toUpperCase();
            return `BREAKING: ${title}`;
          });
          setNews(headlines.slice(0, 6)); // Limit to 6 headlines
          console.log('✅ Crypto news loaded successfully');
        } else {
          throw new Error('No news data received');
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.log('⚠️ Crypto news API failed, using sample data:', error.message);
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
    // Calculate total width needed for all news items
    const totalWidth = news.length * screenWidth;
    
    // Create continuous scrolling animation
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -totalWidth,
        duration: news.length * 8000, // 8 seconds per news item
        useNativeDriver: true,
      }),
      { iterations: -1 } // Infinite loop
    );

    scrollAnimation.start();
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
        <Text style={[styles.loadingText, { color: currentTheme.text.muted }]}>
          Loading news...
        </Text>
      </View>
    );
  }

  const DiagonalDotBackground = () => {
    const dotColor = isDarkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)';
    
    return (
      <Svg 
        width={screenWidth} 
        height={40} 
        style={StyleSheet.absoluteFillObject}
      >
        <Defs>
          <Pattern
            id="diagonalDots"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <SvgCircle
              cx="4"
              cy="4"
              r="1.5"
              fill={dotColor}
            />
          </Pattern>
        </Defs>
        <Rect
          width="100%"
          height="100%"
          fill="url(#diagonalDots)"
        />
      </Svg>
    );
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: isDarkMode 
        ? currentTheme.background.tertiary || '#1a1a1a' 
        : '#f8f9fa' // Slightly lighter for light mode
    }]}>
      {/* Diagonal dot grid background */}
      <DiagonalDotBackground />
      
      <View style={styles.tickerContainer}>
        <Animated.View 
          style={[
            styles.scrollingContent,
            {
              transform: [{ translateX: scrollX }]
            }
          ]}
        >
          {[...news, ...news].map((headline, index) => (
            <React.Fragment key={index}>
              <View style={styles.newsItem}>
                <Text 
                  style={[styles.newsText, { color: currentTheme.accent?.orange || theme.colors.accent.orange }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {headline}
                </Text>
              </View>
              {/* Add dot separator */}
              <View style={styles.dotSeparator}>
                <Text style={[styles.dotText, { color: currentTheme.text.muted }]}>•</Text>
              </View>
            </React.Fragment>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    // Removed marginHorizontal and borderRadius for edge-to-edge
  },
  loadingText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    fontWeight: theme.typography.weights.light,
  },
  tickerContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  scrollingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  newsItem: {
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    minWidth: screenWidth * 0.8,
  },
  newsText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.bold,
    textAlign: 'center',
    numberOfLines: 1,
    textTransform: 'uppercase',
  },
  dotSeparator: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  dotText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
  },
});

export default NewsTicker;