import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');

const CoinTicker = ({ direction = 'left' }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
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
    const totalWidth = coinData.length * screenWidth * 0.6;
    const startValue = direction === 'left' ? 0 : -totalWidth;
    const endValue = direction === 'left' ? -totalWidth : 0;
    
    scrollX.setValue(startValue);
    
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: endValue,
        duration: coinData.length * 6000, // 6 seconds per coin
        useNativeDriver: true,
      }),
      { iterations: -1 }
    );

    scrollAnimation.start();
  };

  const formatPrice = (price) => {
    return price < 1 ? `$${price.toFixed(4)}` : `$${price.toLocaleString()}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tickerContainer}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.bold,
    textTransform: 'uppercase',
  },
  coinPrice: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium,
  },
  coinChange: {
    fontSize: theme.typography.sizes.small,
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