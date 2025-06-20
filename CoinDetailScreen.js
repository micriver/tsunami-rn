import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

export default function CoinDetailScreen({ coin, onClose }) {
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

  const priceChangeColor = price_change_24h >= 0 ? "#00C851" : "#FF4444";

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#2C7D7D", "#1B3D44"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.coinHeader}>
            <Image source={{ uri: image }} style={styles.coinImage} />
            <View>
              <Text style={styles.coinName}>{name}</Text>
              <Text style={styles.coinSymbol}>{symbol.toUpperCase()}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Price Section */}
          <View style={styles.priceSection}>
            <Text style={styles.currentPrice}>${current_price.toLocaleString()}</Text>
            <View style={styles.priceChangeContainer}>
              <Text style={[styles.priceChange, { color: priceChangeColor }]}>
                ${price_change_24h.toFixed(2)}
              </Text>
              <Text style={[styles.priceChangePercent, { color: priceChangeColor }]}>
                ({price_change_percentage_24h?.toFixed(2)}%)
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsContainer}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Market Cap</Text>
                <Text style={styles.statValue}>${market_cap?.toLocaleString()}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Rank</Text>
                <Text style={styles.statValue}>#{market_cap_rank}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>24h Volume</Text>
                <Text style={styles.statValue}>${total_volume?.toLocaleString()}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>24h High</Text>
                <Text style={styles.statValue}>${high_24h?.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>24h Low</Text>
                <Text style={styles.statValue}>${low_24h?.toFixed(2)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>All Time High</Text>
                <Text style={styles.statValue}>${ath?.toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>All Time Low</Text>
                <Text style={styles.statValue}>${atl?.toFixed(4)}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Circulating Supply</Text>
                <Text style={styles.statValue}>
                  {circulating_supply?.toLocaleString()} {symbol.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  coinHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinImage: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  coinName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  coinSymbol: {
    color: "white",
    fontSize: 16,
    opacity: 0.8,
  },
  closeButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  priceSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  currentPrice: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
  },
  priceChangeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceChange: {
    fontSize: 18,
    fontWeight: "600",
    marginRight: 10,
  },
  priceChangePercent: {
    fontSize: 18,
    fontWeight: "600",
  },
  statsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  statLabel: {
    color: "white",
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 5,
  },
  statValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});