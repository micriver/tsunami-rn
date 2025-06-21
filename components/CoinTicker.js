import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const CoinTicker = ({ direction = 'left', isLoginScreen = false }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [isDragging, setIsDragging] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const lastOffset = useRef(0);
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  // Mock coin price data
  const coinData = [
    { symbol: 'BTC', price: 43250, change: 2.5 },
    { symbol: 'ETH', price: 2650, change: -1.2 },
    { symbol: 'BNB', price: 315, change: 4.1 },
    { symbol: 'XRP', price: 0.62, change: -3.7 },
    { symbol: 'ADA', price: 0.48, change: 6.2 },
    { symbol: 'DOGE', price: 0.08, change: -0.8 },
    { symbol: 'SOL', price: 98, change: 8.4 },
    { symbol: 'MATIC', price: 0.89, change: -2.1 },
  ];

  useEffect(() => {
    startScrollAnimation();
  }, []);

  const startScrollAnimation = () => {
    if (isDragging) return;
    
    if (currentAnimation) {
      currentAnimation.stop();
    }

    const totalWidth = coinData.length * screenWidth * 0.6;
    
    // Set initial position if not set
    if (!lastOffset.current) {
      const initialValue = direction === 'left' ? 0 : totalWidth;
      scrollX.setValue(initialValue);
      lastOffset.current = initialValue;
    }
    
    const endValue = direction === 'left' ? -totalWidth : totalWidth;
    
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: endValue,
        duration: coinData.length * 6000, // 6 seconds per coin
        useNativeDriver: true,
      }),
      { iterations: -1 }
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

  const formatPrice = (price) => {
    return price < 1 ? `$${price.toFixed(4)}` : `$${price.toLocaleString()}`;
  };

  return (
    <View style={[
      styles.container,
      isLoginScreen ? styles.loginContainer : styles.mainContainer
    ]}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
      >
        <Animated.View style={styles.tickerContainer}>
          <Animated.View 
            style={[
              styles.scrollingContent,
              {
                transform: [{ translateX: scrollX }]
              }
            ]}
          >
            {[...coinData, ...coinData].map((coin, index) => (
              <React.Fragment key={index}>
                <View style={styles.coinItem}>
                  <Text style={[styles.coinSymbol, { color: currentTheme.text.primary }]}>
                    {coin.symbol}
                  </Text>
                  <Text style={[styles.coinPrice, { color: currentTheme.text.secondary }]}>
                    {formatPrice(coin.price)}
                  </Text>
                  <Text style={[
                    styles.coinChange, 
                    { color: coin.change >= 0 ? theme.colors.indicators.positive : theme.colors.indicators.negative }
                  ]}>
                    {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(1)}%
                  </Text>
                </View>
                <View style={styles.dotSeparator}>
                  <Text style={[styles.dotText, { color: currentTheme.text.muted }]}>•</Text>
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
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  mainContainer: {
    height: 40, // Smaller for main screen
  },
  loginContainer: {
    height: 120, // Much larger for login screen
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
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
    minWidth: screenWidth * 0.6,
    justifyContent: 'center',
  },
  coinSymbol: {
    fontSize: theme.typography.sizes.body, // Larger text
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
  },
  coinPrice: {
    fontSize: theme.typography.sizes.body, // Larger text
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium,
  },
  coinChange: {
    fontSize: theme.typography.sizes.body, // Larger text
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.semibold,
  },
  dotSeparator: {
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  dotText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
  },
});

export default CoinTicker;