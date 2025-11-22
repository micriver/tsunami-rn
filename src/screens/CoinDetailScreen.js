import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
  PanResponder,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import theme from "../theme/theme";
import DetailChart from "../components/DetailChart";
import AnimatedPrice from "../components/AnimatedPrice";
import { useTheme } from "../context/ThemeContext";
import { getCoinDetails } from "../apis/coinGeckoAPI";

const { height, width } = Dimensions.get("window");

export default function CoinDetailScreen({ coin, onClose }) {
  const [previousPrice, setPreviousPrice] = useState(null);
  const [coinDetails, setCoinDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(true);
  const [cryptoAmount, setCryptoAmount] = useState("1");
  const [usdAmount, setUsdAmount] = useState("");
  const { isDarkMode } = useTheme();

  // Animation setup
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  // Currency conversion functions
  const handleCryptoAmountChange = (value) => {
    setCryptoAmount(value);
    if (value && !isNaN(value) && current_price) {
      const usdValue = (parseFloat(value) * current_price).toFixed(2);
      setUsdAmount(usdValue);
    } else {
      setUsdAmount("");
    }
  };

  const handleUsdAmountChange = (value) => {
    setUsdAmount(value);
    if (value && !isNaN(value) && current_price) {
      const cryptoValue = (parseFloat(value) / current_price).toFixed(8);
      setCryptoAmount(cryptoValue);
    } else {
      setCryptoAmount("");
    }
  };

  // Initialize converter with 1 unit of crypto
  useEffect(() => {
    if (current_price) {
      handleCryptoAmountChange("1");
    }
  }, [current_price]);

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

  // Animation effects
  useEffect(() => {
    // Slide in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 50, // Leave space at top (50px from top)
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  // Pan responder for swipe down gesture
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          gestureState.dy > 10 &&
          Math.abs(gestureState.dx) < Math.abs(gestureState.dy)
        );
      },
      onPanResponderMove: (evt, gestureState) => {
        const newValue = Math.max(50, 50 + gestureState.dy); // Don't go above starting position
        slideAnim.setValue(newValue);
        const opacity = Math.max(0, 1 - (gestureState.dy / height) * 1.5);
        backdropOpacity.setValue(opacity);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.parallel([
            Animated.spring(slideAnim, {
              toValue: 50,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

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
    <View style={styles.modalContainer}>
      <StatusBar style={isDarkMode ? "light" : "auto"} />
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]} />

      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modalContent,
          {
            transform: [{ translateY: slideAnim }],
            backgroundColor: currentTheme.background.primary,
          },
        ]}
        {...panResponder.panHandlers}
      >
        {/* Drag Handle */}
        <View style={styles.dragHandle}>
          <View
            style={[
              styles.dragIndicator,
              { backgroundColor: currentTheme.text.muted },
            ]}
          />
        </View>

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
                        currentTheme.brand?.primary ||
                        theme.colors.brand.primary,
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
              onPress={handleClose}
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

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
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
                  style={[
                    styles.priceChangePercent,
                    { color: priceChangeColor },
                  ]}
                >
                  ({price_change_percentage_24h?.toFixed(2)}%)
                </Text>
              </View>
            </View>

            {/* Price Chart */}
            <DetailChart coinId={coin.id} />

            {/* Currency Converter */}
            <View
              style={[
                styles.converterContainer,
                { backgroundColor: currentTheme.background.secondary },
              ]}
            >
              <Text
                style={[
                  styles.converterTitle,
                  { color: currentTheme.text.primary },
                ]}
              >
                Currency Converter
              </Text>

              <View style={styles.converterRow}>
                <View style={styles.converterInput}>
                  <Text
                    style={[
                      styles.converterLabel,
                      { color: currentTheme.text.secondary },
                    ]}
                  >
                    {symbol.toUpperCase()}
                  </Text>
                  <TextInput
                    style={[
                      styles.converterTextInput,
                      {
                        color: currentTheme.text.primary,
                        backgroundColor: currentTheme.background.primary,
                        borderColor: currentTheme.background.tertiary,
                      },
                    ]}
                    value={cryptoAmount}
                    onChangeText={handleCryptoAmountChange}
                    keyboardType='numeric'
                    placeholder='0'
                    placeholderTextColor={currentTheme.text.muted}
                  />
                </View>

                <MaterialIcons
                  name='swap-horiz'
                  size={24}
                  color={currentTheme.text.muted}
                  style={styles.converterIcon}
                />

                <View style={styles.converterInput}>
                  <Text
                    style={[
                      styles.converterLabel,
                      { color: currentTheme.text.secondary },
                    ]}
                  >
                    USD
                  </Text>
                  <TextInput
                    style={[
                      styles.converterTextInput,
                      {
                        color: currentTheme.text.primary,
                        backgroundColor: currentTheme.background.primary,
                        borderColor: currentTheme.background.tertiary,
                      },
                    ]}
                    value={usdAmount}
                    onChangeText={handleUsdAmountChange}
                    keyboardType='numeric'
                    placeholder='0.00'
                    placeholderTextColor={currentTheme.text.muted}
                  />
                </View>
              </View>
            </View>

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
                  style={[
                    styles.statValue,
                    { color: currentTheme.text.primary },
                  ]}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={2}
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
                  style={[
                    styles.statValue,
                    { color: currentTheme.text.primary },
                  ]}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={2}
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
                  style={[
                    styles.statValue,
                    { color: currentTheme.text.primary },
                  ]}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={2}
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
                  style={[
                    styles.statValue,
                    { color: currentTheme.text.primary },
                  ]}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={2}
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
                  style={[
                    styles.statValue,
                    { color: currentTheme.text.primary },
                  ]}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={2}
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
                  style={[
                    styles.statValue,
                    { color: currentTheme.text.primary },
                  ]}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={2}
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
                  style={[
                    styles.statValue,
                    { color: currentTheme.text.primary },
                  ]}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
                  numberOfLines={2}
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
                  style={[
                    styles.statValue,
                    { color: currentTheme.text.primary },
                  ]}
                  adjustsFontSizeToFit={true}
                  minimumFontScale={0.7}
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
                    <Text style={styles.websiteButtonText}>
                      Official Website
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    overflow: "hidden",
  },
  dragHandle: {
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    opacity: 0.3,
  },
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
  scrollContent: {
    paddingBottom: theme.spacing.xxxl * 2, // Extra bottom padding for scrolling
  },
  priceSection: {
    alignItems: "center",
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
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
  converterContainer: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  converterTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  converterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  converterInput: {
    flex: 1,
    alignItems: "center",
  },
  converterLabel: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  converterTextInput: {
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    textAlign: "center",
    minWidth: 100,
    width: "100%",
  },
  converterIcon: {
    marginHorizontal: theme.spacing.md,
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
