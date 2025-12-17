import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';
import { useWatchlist } from '../context/WatchlistContext';
import { getWatchlistData } from '../apis/coinGeckoAPI';
import CryptocurrencyListItem from '../components/CryptocurrencyListItem';

export default function MyWatchlistScreen({ onCoinSelect, onClose }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  const { lists, activeListId, setActiveListId, deleteList } = useWatchlist();

  const [watchlistData, setWatchlistData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const activeList = lists[activeListId];

  const fetchWatchlistData = useCallback(async () => {
    if (!activeList || activeList.coins.length === 0) {
        setWatchlistData([]);
        return;
    }
    setLoading(true);
    try {
      const data = await getWatchlistData(activeList.coins);
      setWatchlistData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [activeList?.coins]);

  useEffect(() => {
      fetchWatchlistData();
  }, [activeList, fetchWatchlistData]);

  const onRefresh = () => {
      setRefreshing(true);
      fetchWatchlistData();
  };
  
  // Calculate metrics
  const totalMarketCap = watchlistData.reduce((acc, coin) => acc + (coin.market_cap || 0), 0);
  const totalVolume = watchlistData.reduce((acc, coin) => acc + (coin.total_volume || 0), 0);
  const avgChange = watchlistData.length > 0 
      ? watchlistData.reduce((acc, coin) => acc + (coin.price_change_percentage_24h || 0), 0) / watchlistData.length
      : 0;

  const formatCurrency = (value) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    }
    return `$${value.toLocaleString()}`;
  };

  const renderMetricsCard = () => (
      <View style={[styles.metricsCard, { backgroundColor: currentTheme.background.secondary }]}>
          <View style={styles.metricRow}>
              <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: currentTheme.text.secondary }]}>Total Market Cap</Text>
                  <Text style={[styles.metricValue, { color: currentTheme.text.primary }]}>
                      {formatCurrency(totalMarketCap)}
                  </Text>
              </View>
              <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: currentTheme.text.secondary }]}>Avg 24h Change</Text>
                  <Text style={[styles.metricValue, { color: avgChange >= 0 ? (currentTheme.indicators?.positive || theme.colors.indicators.positive) : (currentTheme.indicators?.negative || theme.colors.indicators.negative) }]}>
                      {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(2)}%
                  </Text>
              </View>
          </View>
          <View style={[styles.metricRow, { marginTop: theme.spacing.md }]}>
               <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: currentTheme.text.secondary }]}>24h Volume</Text>
                  <Text style={[styles.metricValue, { color: currentTheme.text.primary }]}>
                      {formatCurrency(totalVolume)}
                  </Text>
              </View>
              <View style={styles.metricItem}>
                  <Text style={[styles.metricLabel, { color: currentTheme.text.secondary }]}>Coins</Text>
                  <Text style={[styles.metricValue, { color: currentTheme.text.primary }]}>
                      {watchlistData.length}
                  </Text>
              </View>
          </View>
      </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: currentTheme.text.primary }]}>My Watchlist</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={currentTheme.text.primary} />
        </TouchableOpacity>
      </View>

      {/* List Selector */}
      <View style={styles.listSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listSelectorContent}>
            {Object.values(lists).map(list => (
                <TouchableOpacity 
                    key={list.id} 
                    style={[
                        styles.listChip, 
                        activeListId === list.id ? 
                            { backgroundColor: currentTheme.brand?.primary || theme.colors.brand.primary } : 
                            { backgroundColor: currentTheme.background.tertiary }
                    ]}
                    onPress={() => setActiveListId(list.id)}
                >
                    <Text style={[
                        styles.listChipText,
                        activeListId === list.id ? { color: '#ffffff' } : { color: currentTheme.text.primary }
                    ]}>
                        {list.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

      <FlatList
        data={watchlistData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <CryptocurrencyListItem 
            currency={item} 
            index={index}
            onPress={() => onCoinSelect && onCoinSelect(item)} 
          />
        )}
        ListHeaderComponent={watchlistData.length > 0 ? renderMetricsCard : null}
        contentContainerStyle={styles.listContent}
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={currentTheme.text.primary} />
        }
        ListEmptyComponent={
            <View style={styles.emptyContainer}>
                <View style={[styles.iconContainer, { backgroundColor: currentTheme.background.secondary }]}>
                    <Ionicons 
                        name="star-outline" 
                        size={48} 
                        color={currentTheme.text.muted} 
                    />
                </View>
                <Text style={[styles.emptyText, { color: currentTheme.text.primary }]}>
                    Your watchlist is empty
                </Text>
                <Text style={[styles.emptySubText, { color: currentTheme.text.secondary }]}>
                    Add coins to your "{lists[activeListId]?.name}" list to track them here.
                </Text>
            </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
  listSelector: {
    paddingVertical: theme.spacing.md,
  },
  listSelectorContent: {
    paddingHorizontal: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  listChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  listChipText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  metricsCard: {
    margin: theme.spacing.lg,
    marginTop: theme.spacing.xs,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.subtle,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
  },
  metricLabel: {
    fontSize: theme.typography.sizes.caption,
    marginBottom: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  },
  metricValue: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  listContent: {
    paddingBottom: theme.spacing.xxxl,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xxxl,
    marginTop: theme.spacing.xxxl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  emptyText: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
  emptySubText: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
});