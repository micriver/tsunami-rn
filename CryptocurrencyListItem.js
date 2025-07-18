import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import theme from "./theme";
import MiniChart from "./components/MiniChart";
import AnimatedPrice from "./components/AnimatedPrice";
import { useTheme } from "./context/ThemeContext";

const CryptocurrencyListItem = ({ currency, index, onPress }) => {
  const { name, symbol, current_price, price_change_24h, image, sparkline_in_7d } = currency;
  const [previousPrice, setPreviousPrice] = useState(current_price);
  const [previousChange, setPreviousChange] = useState(price_change_24h);
  const { isDarkMode } = useTheme();
  
  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  
  const changeFlashAnim = useRef(new Animated.Value(0)).current;
  const changeScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (previousPrice !== current_price) {
      setPreviousPrice(current_price);
    }
  }, [current_price]);

  useEffect(() => {
    if (previousChange !== price_change_24h && typeof price_change_24h === 'number') {
      // Animate the percentage change
      Animated.sequence([
        Animated.timing(changeFlashAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(changeFlashAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();

      Animated.sequence([
        Animated.timing(changeScaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(changeScaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      setPreviousChange(price_change_24h);
    }
  }, [price_change_24h]);

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: currentTheme.background.secondary }]}>
      <View style={styles.item}>
        <View style={styles.leftSection}>
          <Text style={[styles.rankText, { color: currentTheme.text.muted }]}>
            {index + 1}
          </Text>
          <Image source={{ uri: image }} style={styles.coinImage} />
          <View style={styles.coinInfo}>
            <Text style={[styles.coinName, { color: currentTheme.text.primary }]} numberOfLines={1} ellipsizeMode="tail" adjustsFontSizeToFit={true} minimumFontScale={0.7}>{name}</Text>
            <Text style={[styles.coinSymbol, { color: currentTheme.text.secondary }]}>{symbol.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <MiniChart 
            sparklineData={sparkline_in_7d?.price || null} 
            priceChange={price_change_24h || 0}
          />
        </View>

        <View style={styles.rightSection}>
          <AnimatedPrice
            price={current_price}
            previousPrice={previousPrice}
            style={[styles.priceText, { 
              color: isDarkMode ? '#ffffff' : '#000000' // White in dark mode, black in light mode
            }]}
          />
          <Animated.View 
            style={[
              styles.changeIndicator, 
              price_change_24h < 0 ? 
                { backgroundColor: currentTheme.indicators?.negativeBg || theme.colors.indicators.negativeBg } : 
                { backgroundColor: currentTheme.indicators?.positiveBg || theme.colors.indicators.positiveBg },
              { transform: [{ scale: changeScaleAnim }] }
            ]}
          >
            <Animated.Text 
              style={[
                styles.changeText, 
                { 
                  color: changeFlashAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      price_change_24h < 0 ? 
                        (currentTheme.indicators?.negative || theme.colors.indicators.negative) : 
                        (currentTheme.indicators?.positive || theme.colors.indicators.positive),
                      price_change_24h < 0 ? '#ff6b6b' : '#51cf66' // Brighter colors for flash
                    ]
                  })
                }
              ]}
            >
              {price_change_24h >= 0 ? '+' : ''}{price_change_24h.toFixed(2)}%
            </Animated.Text>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CryptocurrencyListItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.subtle,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    minHeight: theme.components.listItem.height,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: '100%',
  },
  rankText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
    minWidth: 32,
    textAlign: 'center',
    marginRight: theme.spacing.md,
    lineHeight: theme.typography.sizes.body * 1.2,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  coinImage: {
    height: 32,
    width: 32,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  coinInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  coinName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.small, // Reduced from body to small
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    flexShrink: 1,
    lineHeight: theme.typography.sizes.small * 1.2,
  },
  coinSymbol: {
    fontSize: theme.typography.sizes.caption - 1, // Made slightly smaller
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily,
    marginTop: 2, // Reduced margin
    lineHeight: (theme.typography.sizes.caption - 1) * 1.2,
  },
  chartSection: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.sm,
  },
  rightSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 100,
  },
  priceText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.small, // Reduced from body to small
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'right',
  },
  changeIndicator: {
    marginTop: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  positive: {
    backgroundColor: theme.colors.indicators.positiveBg,
  },
  negative: {
    backgroundColor: theme.colors.indicators.negativeBg,
  },
  changeText: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
  },
});
