import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import theme from "./theme";
import DetailChart from "./components/DetailChart";
import AnimatedPrice from "./components/AnimatedPrice";
import { useTheme } from "./context/ThemeContext";

const { height, width } = Dimensions.get("window");

export default function CoinDetailScreen({ coin, onClose }) {
  const [previousPrice, setPreviousPrice] = useState(null);
  const { isDarkMode } = useTheme();
  
  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  // Move all hooks before early return
  useEffect(() => {
    if (coin && coin.current_price !== undefined) {
      setPreviousPrice(coin.current_price);
    }
  }, [coin?.current_price]);

  if (!coin) return null;

  const {
    name,
    symbol,
    current_price,
    price_change_24h,
    price_change_percentage_24h,
    market_cap,
    market_cap_rank,
    total_volume,
    high_24h,
    low_24h,
    image,
    ath,
    atl,
    circulating_supply,
  } = coin;

  const priceChangeColor = price_change_24h >= 0 ? theme.colors.indicators.positive : theme.colors.indicators.negative;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <View style={[styles.background, { backgroundColor: currentTheme.background.primary }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.coinHeader}>
            <Image source={{ uri: image }} style={styles.coinImage} />
            <View>
              <Text style={[styles.coinName, { color: currentTheme.text.primary }]}>{name}</Text>
              <Text style={[styles.coinSymbol, { color: currentTheme.text.secondary }]}>{symbol.toUpperCase()}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={28} color={currentTheme.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Section */}
          <View style={styles.priceSection}>
            <AnimatedPrice
              price={current_price}
              previousPrice={previousPrice}
              style={styles.currentPrice}
            />
            <View style={styles.priceChangeContainer}>
              <Text style={[styles.priceChange, { color: priceChangeColor }]}>
                ${price_change_24h.toFixed(2)}
              </Text>
              <Text style={[styles.priceChangePercent, { color: priceChangeColor }]}>
                ({price_change_percentage_24h?.toFixed(2)}%)
              </Text>
            </View>
          </View>

          {/* Price Chart */}
          <DetailChart coinId={coin.id} />

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Market Cap</Text>
              <Text style={styles.statValue}>${market_cap?.toLocaleString()}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Rank</Text>
              <Text style={styles.statValue}>#{market_cap_rank}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>24h Volume</Text>
              <Text style={styles.statValue}>${total_volume?.toLocaleString()}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>24h High</Text>
              <Text style={styles.statValue}>${high_24h?.toFixed(2)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>24h Low</Text>
              <Text style={styles.statValue}>${low_24h?.toFixed(2)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>All Time High</Text>
              <Text style={styles.statValue}>${ath?.toLocaleString()}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>All Time Low</Text>
              <Text style={styles.statValue}>${atl?.toFixed(4)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Circulating Supply</Text>
              <Text style={styles.statValue} numberOfLines={2}>
                {circulating_supply?.toLocaleString()} {symbol.toUpperCase()}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  coinHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinImage: {
    width: 50,
    height: 50,
    marginRight: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
  },
  coinName: {
    color: theme.colors.brand.primary,
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  coinSymbol: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  },
  closeButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  priceSection: {
    alignItems: "center",
    marginBottom: theme.spacing.xxxl,
  },
  currentPrice: {
    color: theme.colors.text.primary,
    fontSize: 36,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
  priceChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceChange: {
    fontSize: theme.typography.sizes.body + 2,
    fontWeight: theme.typography.weights.semibold,
    marginRight: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
  priceChangePercent: {
    fontSize: theme.typography.sizes.body + 2,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.xs,
  },
  statCard: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    width: '48%',
    ...theme.shadows.subtle,
  },
  statLabel: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.caption,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  },
  statValue: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
});