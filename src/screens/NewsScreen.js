import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

import NewsTicker from '../components/NewsTicker';
import FearGreedIndex from '../components/FearGreedIndex';
import NewsCard from '../components/NewsCard';
import NewsFilterModal from '../components/NewsFilterModal';

// Mock news data - will be replaced with API data later
const MOCK_NEWS = [
  {
    id: '1',
    headline: 'Bitcoin Surges Past $100K as Institutional Adoption Accelerates Worldwide',
    source: 'CoinDesk',
    timeAgo: '2h ago',
    category: 'Bitcoin',
  },
  {
    id: '2',
    headline: "Ethereum's Layer 2 Solutions See Record Transaction Volume This Quarter",
    source: 'The Block',
    timeAgo: '4h ago',
    category: 'Ethereum',
  },
  {
    id: '3',
    headline: 'Federal Reserve Signals Positive Stance on Digital Asset Regulation',
    source: 'Bloomberg Crypto',
    timeAgo: '5h ago',
    category: 'Regulation',
  },
  {
    id: '4',
    headline: 'Major Bank Launches Cryptocurrency Custody Services for Institutional Clients',
    source: 'Reuters',
    timeAgo: '8h ago',
    category: 'Markets',
  },
  {
    id: '5',
    headline: 'NFT Market Rebounds with New Gaming Integrations and Partnerships',
    source: 'Decrypt',
    timeAgo: '12h ago',
    category: 'NFT',
  },
  {
    id: '6',
    headline: 'DeFi Protocol Total Value Locked Reaches All-Time High Amid Bull Run',
    source: 'CoinTelegraph',
    timeAgo: '1d ago',
    category: 'DeFi',
  },
];

export default function NewsScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  
  // Filter state
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Filter news based on selected categories
  const filteredNews = selectedFilters.length === 0
    ? MOCK_NEWS
    : MOCK_NEWS.filter((item) => selectedFilters.includes(item.category));

  const handleNewsPress = (newsItem) => {
    console.log('News pressed:', newsItem.headline);
    // Will implement navigation to full article later
  };

  const handleApplyFilters = (filters) => {
    setSelectedFilters(filters);
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
  };

  const hasActiveFilters = selectedFilters.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <NewsTicker />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <FearGreedIndex />
        
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text.primary }]}>
            Latest News
          </Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons
              name={hasActiveFilters ? 'filter' : 'filter-outline'}
              size={20}
              color={hasActiveFilters ? theme.colors.accent.orange : currentTheme.text.secondary}
            />
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{selectedFilters.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Empty state when no articles match filters */}
        {filteredNews.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="newspaper-outline"
              size={48}
              color={currentTheme.text.muted}
            />
            <Text style={[styles.emptyStateTitle, { color: currentTheme.text.primary }]}>
              No articles found
            </Text>
            <Text style={[styles.emptyStateSubtitle, { color: currentTheme.text.secondary }]}>
              Try adjusting your filters to see more news
            </Text>
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearFiltersButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredNews.map((newsItem) => (
            <NewsCard
              key={newsItem.id}
              headline={newsItem.headline}
              source={newsItem.source}
              timeAgo={newsItem.timeAgo}
              category={newsItem.category}
              onPress={() => handleNewsPress(newsItem)}
            />
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <NewsFilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedFilters={selectedFilters}
        onApply={handleApplyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  filterBadge: {
    backgroundColor: theme.colors.accent.orange,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.xs,
  },
  filterBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyStateTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  clearFiltersButton: {
    backgroundColor: theme.colors.accent.orange,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  clearFiltersButtonText: {
    color: '#ffffff',
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
});
