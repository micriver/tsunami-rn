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
import { getCoinDetails } from "./apis/coinGeckoAPI";

const { height, width } = Dimensions.get("window");

export default function CoinDetailScreen({ coin, onClose }) {
  const [previousPrice, setPreviousPrice] = useState(null);
  const [coinDetails, setCoinDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const { isDarkMode } = useTheme();

  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  // Move all hooks before early return
  useEffect(() => {
    if (coin && coin.current_price !== undefined) {
      setPreviousPrice(coin.current_price);
    }
  }, [coin?.current_price]);

  // Fetch coin details when component mounts
  useEffect(() => {
    const fetchCoinDetails = async () => {
      if (!coin?.id) return;

      try {
        setIsLoadingDetails(true);
        const details = await getCoinDetails(coin.id);
        setCoinDetails(details);
      } catch (error) {
        console.error("Failed to fetch coin details:", error);
      } finally {
        setIsLoadingDetails(false);
      }
    };

    fetchCoinDetails();
  }, [coin?.id]);

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

  const priceChangeColor =
    price_change_24h >= 0
      ? currentTheme.indicators?.positive || theme.colors.indicators.positive
      : currentTheme.indicators?.negative || theme.colors.indicators.negative;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.background.primary },
      ]}
    >
      <View
        style={[
          styles.background,
          { backgroundColor: currentTheme.background.primary },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.coinHeader}>
            <Image source={{ uri: image }} style={styles.coinImage} />
            <View>
              <Text
                style={[
                  styles.coinName,
                  {
                    color:
                      currentTheme.brand?.primary || theme.colors.brand.primary,
                  },
                ]}
              >
                {name}
              </Text>
              <Text
                style={[
                  styles.coinSymbol,
                  { color: currentTheme.text.secondary },
                ]}
              >
                {symbol.toUpperCase()}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={onClose}
            style={[
              styles.closeButton,
              { backgroundColor: currentTheme.background.secondary },
            ]}
          >
            <MaterialIcons
              name='close'
              size={28}
              color={currentTheme.text.primary}
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Section */}
          <View style={styles.priceSection}>
            <AnimatedPrice
              price={current_price}
              previousPrice={previousPrice}
              style={[
                styles.currentPrice,
                {
                  color: isDarkMode ? "#ffffff" : "#000000",
                },
              ]}
            />
            <View style={styles.priceChangeContainer}>
              <Text style={[styles.priceChange, { color: priceChangeColor }]}>
                $
                {price_change_24h?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
              <Text
                style={[styles.priceChangePercent, { color: priceChangeColor }]}
              >
                ({price_change_percentage_24h?.toFixed(2)}%)
              </Text>
            </View>
          </View>

          {/* Price Chart */}
          <DetailChart coinId={coin.id} />

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.statCard,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  { color: currentTheme.text.secondary },
                ]}
              >
                Market Cap
              </Text>
              <Text
                style={[styles.statValue, { color: currentTheme.text.primary }]}
              >
                $
                {market_cap?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  { color: currentTheme.text.secondary },
                ]}
              >
                Rank
              </Text>
              <Text
                style={[styles.statValue, { color: currentTheme.text.primary }]}
              >
                #{market_cap_rank}
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  { color: currentTheme.text.secondary },
                ]}
              >
                24h Volume
              </Text>
              <Text
                style={[styles.statValue, { color: currentTheme.text.primary }]}
              >
                $
                {total_volume?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  { color: currentTheme.text.secondary },
                ]}
              >
                24h High
              </Text>
              <Text
                style={[styles.statValue, { color: currentTheme.text.primary }]}
              >
                $
                {high_24h?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  { color: currentTheme.text.secondary },
                ]}
              >
                24h Low
              </Text>
              <Text
                style={[styles.statValue, { color: currentTheme.text.primary }]}
              >
                $
                {low_24h?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  { color: currentTheme.text.secondary },
                ]}
              >
                All Time High
              </Text>
              <Text
                style={[styles.statValue, { color: currentTheme.text.primary }]}
              >
                $
                {ath?.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  { color: currentTheme.text.secondary },
                ]}
              >
                All Time Low
              </Text>
              <Text
                style={[styles.statValue, { color: currentTheme.text.primary }]}
              >
                $
                {atl?.toLocaleString(undefined, {
                  minimumFractionDigits: atl && atl < 1 ? 4 : 2,
                  maximumFractionDigits: atl && atl < 1 ? 4 : 2,
                })}
              </Text>
            </View>
            <View
              style={[
                styles.statCard,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.statLabel,
                  { color: currentTheme.text.secondary },
                ]}
              >
                Circulating Supply
              </Text>
              <Text
                style={[styles.statValue, { color: currentTheme.text.primary }]}
                numberOfLines={2}
              >
                {circulating_supply?.toLocaleString(undefined, {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}{" "}
                {symbol.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Description Section */}
          {coinDetails?.description?.en && (
            <View
              style={[
                styles.descriptionContainer,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: currentTheme.text.primary },
                ]}
              >
                About {name}
              </Text>
              <Text
                style={[
                  styles.descriptionText,
                  { color: currentTheme.text.secondary },
                ]}
                numberOfLines={5}
                ellipsizeMode='tail'
              >
                {coinDetails.description.en.replace(/<[^>]*>/g, "")}{" "}
                {/* Strip HTML tags */}
              </Text>
              {coinDetails.links?.homepage?.[0] && (
                <TouchableOpacity
                  style={[
                    styles.websiteButton,
                    {
                      backgroundColor:
                        currentTheme.brand?.primary ||
                        theme.colors.brand.primary,
                    },
                  ]}
                  onPress={() => {
                    const url = coinDetails.links.homepage[0];
                    if (url) {
                      require("react-native")
                        .Linking.openURL(url)
                        .catch((err) =>
                          console.error("Failed to open URL:", err)
                        );
                    }
                  }}
                >
                  <MaterialIcons name='language' size={16} color='#ffffff' />
                  <Text style={styles.websiteButtonText}>Official Website</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
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
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  coinSymbol: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  },
  closeButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  priceSection: {
    alignItems: "center",
    marginBottom: theme.spacing.lg, // Reduced from xxxl to lg
  },
  currentPrice: {
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
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    width: "48%",
    ...theme.shadows.subtle,
  },
  statLabel: {
    fontSize: theme.typography.sizes.caption,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  },
  statValue: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
  descriptionContainer: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.subtle,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.sm,
  },
  descriptionText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    lineHeight: theme.typography.sizes.body * 1.5,
    marginBottom: theme.spacing.md,
  },
  websiteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignSelf: "flex-start",
  },
  websiteButtonText: {
    color: "#ffffff",
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    marginLeft: theme.spacing.xs,
  },
});
