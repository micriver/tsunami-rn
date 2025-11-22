import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';
import FearGreedIndex from '../components/FearGreedIndex';
import { getMarketData } from '../apis/coinGeckoAPI';

export default function MarketsScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  const [totalVolume, setTotalVolume] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const formatVolume = (volume) => {
    if (volume >= 1e12) {
      return `$${(volume / 1e12).toFixed(2)} Tn`;
    } else if (volume >= 1e9) {
      return `$${(volume / 1e9).toFixed(2)} Bn`;
    } else if (volume >= 1e6) {
      return `$${(volume / 1e6).toFixed(2)} Mn`;
    } else {
      return `$${volume.toLocaleString()}`;
    }
  };

  useEffect(() => {
    async function fetchMarketData() {
      try {
        setIsLoading(true);
        const prices = await getMarketData(25);
        if (prices && prices.length > 0) {
          const total = prices.reduce((sum, coin) => sum + (coin.total_volume || 0), 0);
          setTotalVolume(total);
        }
      } catch (error) {
        console.log("Failed to fetch market data for volume:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMarketData();
  }, []);

  return (
    <ScrollView style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <FearGreedIndex />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.subheader, { color: currentTheme.brand?.primary || currentTheme.brand.primary }]}>Markets</Text>
            <Text style={[styles.subtitle, { color: currentTheme.text.secondary }]}>
              24h Volume {isLoading ? '...' : formatVolume(totalVolume)}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subheader: {
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.h2,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  },
  subtitle: {
    fontSize: theme.typography.sizes.body,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
  },
});
