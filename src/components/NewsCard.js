import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

const NewsCard = ({ 
  headline, 
  source, 
  timeAgo, 
  category,
  onPress 
}) => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const getCategoryColor = (cat) => {
    const colors = {
      'Bitcoin': '#F7931A',
      'Ethereum': '#627EEA',
      'DeFi': '#00D395',
      'NFT': '#FF6B6B',
      'Regulation': '#6366F1',
      'Markets': theme.colors.accent.orange,
    };
    return colors[cat] || currentTheme.brand?.primary || theme.colors.brand.primary;
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { backgroundColor: currentTheme.background.secondary }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        {/* Category tag */}
        {category && (
          <View style={[styles.categoryTag, { backgroundColor: getCategoryColor(category) + '20' }]}>
            <Text style={[styles.categoryText, { color: getCategoryColor(category) }]}>
              {category}
            </Text>
          </View>
        )}

        {/* Headline */}
        <Text 
          style={[styles.headline, { color: currentTheme.text.primary }]}
          numberOfLines={3}
        >
          {headline}
        </Text>

        {/* Source and time */}
        <View style={styles.metaContainer}>
          <View style={styles.sourceContainer}>
            <Ionicons 
              name="newspaper-outline" 
              size={14} 
              color={currentTheme.text.muted} 
            />
            <Text style={[styles.source, { color: currentTheme.text.secondary }]}>
              {source}
            </Text>
          </View>
          <Text style={[styles.timeAgo, { color: currentTheme.text.muted }]}>
            {timeAgo}
          </Text>
        </View>
      </View>

      {/* Arrow indicator */}
      <View style={styles.arrowContainer}>
        <Ionicons 
          name="chevron-forward" 
          size={20} 
          color={currentTheme.text.muted} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: theme.borderRadius.lg,
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    ...theme.shadows.subtle,
  },
  contentContainer: {
    flex: 1,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  categoryText: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  headline: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    lineHeight: theme.typography.sizes.body * theme.typography.lineHeights.normal,
    marginBottom: theme.spacing.md,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  source: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    marginLeft: theme.spacing.xs,
  },
  timeAgo: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
  },
  arrowContainer: {
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
});

export default NewsCard;
