import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import theme from "./theme";
import MiniChart from "./components/MiniChart";
import AnimatedPrice from "./components/AnimatedPrice";

const CryptocurrencyListItem = ({ currency, index, onPress }) => {
  const { name, symbol, current_price, price_change_24h, image, sparkline_in_7d } = currency;
  const [previousPrice, setPreviousPrice] = useState(current_price);

  useEffect(() => {
    if (previousPrice !== current_price) {
      setPreviousPrice(current_price);
    }
  }, [current_price]);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.item}>
        <View style={styles.leftSection}>
          <Text style={styles.rankText}>
            {index + 1}
          </Text>
          <Image source={{ uri: image }} style={styles.coinImage} />
          <View style={styles.coinInfo}>
            <Text style={styles.coinName} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
            <Text style={styles.coinSymbol}>{symbol.toUpperCase()}</Text>
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
            style={styles.priceText}
          />
          <View style={[styles.changeIndicator, price_change_24h < 0 ? styles.negative : styles.positive]}>
            <Text style={[styles.changeText, { color: price_change_24h < 0 ? theme.colors.indicators.negative : theme.colors.indicators.positive }]}>
              {price_change_24h >= 0 ? '+' : ''}{price_change_24h.toFixed(2)}%
            </Text>
          </View>
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
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    flexShrink: 1,
    lineHeight: theme.typography.sizes.body * 1.2,
  },
  coinSymbol: {
    fontSize: theme.typography.sizes.caption,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily,
    marginTop: 4,
    lineHeight: theme.typography.sizes.caption * 1.2,
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
    fontSize: theme.typography.sizes.body,
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
