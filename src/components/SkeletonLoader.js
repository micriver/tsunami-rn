import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import theme from '../theme/theme';

// Base skeleton component with shimmer animation
const SkeletonBase = ({ width, height, borderRadius = theme.borderRadius.sm, style }) => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => shimmerAnimation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: currentTheme.background.tertiary,
          opacity,
        },
        style,
      ]}
    />
  );
};

// Skeleton for Market list item (matches CryptocurrencyListItem layout)
export const MarketItemSkeleton = () => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  return (
    <View style={[styles.marketItem, { backgroundColor: currentTheme.background.secondary }]}>
      {/* Rank */}
      <SkeletonBase width={24} height={16} style={styles.rankSkeleton} />

      {/* Coin icon */}
      <SkeletonBase
        width={32}
        height={32}
        borderRadius={theme.borderRadius.full}
        style={styles.iconSkeleton}
      />

      {/* Coin info */}
      <View style={styles.coinInfoSkeleton}>
        <SkeletonBase width={80} height={14} style={styles.nameSkeleton} />
        <SkeletonBase width={40} height={12} style={styles.symbolSkeleton} />
      </View>

      {/* Mini chart area */}
      <SkeletonBase width={60} height={30} style={styles.chartSkeleton} />

      {/* Price section */}
      <View style={styles.priceSectionSkeleton}>
        <SkeletonBase width={70} height={14} style={styles.priceSkeleton} />
        <SkeletonBase width={50} height={20} borderRadius={theme.borderRadius.sm} style={styles.changeSkeleton} />
      </View>
    </View>
  );
};

// Multiple market item skeletons
export const MarketListSkeleton = ({ count = 10 }) => {
  return (
    <View style={styles.marketListContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <MarketItemSkeleton key={index} />
      ))}
    </View>
  );
};

// Skeleton for Portfolio holding item
export const HoldingItemSkeleton = () => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  return (
    <View style={[styles.holdingItem, { backgroundColor: currentTheme.background.secondary }]}>
      {/* Left section - icon and info */}
      <View style={styles.holdingLeft}>
        <SkeletonBase
          width={40}
          height={40}
          borderRadius={theme.borderRadius.full}
          style={styles.holdingIconSkeleton}
        />
        <View style={styles.holdingInfoSkeleton}>
          <SkeletonBase width={80} height={16} style={styles.holdingNameSkeleton} />
          <SkeletonBase width={60} height={12} style={styles.holdingQuantitySkeleton} />
        </View>
      </View>

      {/* Right section - value and change */}
      <View style={styles.holdingRight}>
        <SkeletonBase width={70} height={16} style={styles.holdingValueSkeleton} />
        <View style={styles.holdingPriceRow}>
          <SkeletonBase width={50} height={12} style={styles.holdingPriceSkeleton} />
          <SkeletonBase width={45} height={18} borderRadius={theme.borderRadius.sm} />
        </View>
      </View>
    </View>
  );
};

// Multiple holding item skeletons
export const HoldingsListSkeleton = ({ count = 3 }) => {
  return (
    <View style={styles.holdingsListContainer}>
      {Array.from({ length: count }).map((_, index) => (
        <HoldingItemSkeleton key={index} />
      ))}
    </View>
  );
};

// Portfolio balance card skeleton
export const BalanceCardSkeleton = () => {
  return (
    <View style={styles.balanceCard}>
      <SkeletonBase width={80} height={14} style={styles.balanceLabelSkeleton} />
      <SkeletonBase width={180} height={48} style={styles.balanceValueSkeleton} />
      <SkeletonBase width={100} height={16} style={styles.balanceChangeSkeleton} />
    </View>
  );
};

// Full portfolio skeleton
export const PortfolioSkeleton = () => {
  return (
    <View style={styles.portfolioContainer}>
      <BalanceCardSkeleton />
      <SkeletonBase width={80} height={20} style={styles.sectionTitleSkeleton} />
      <HoldingsListSkeleton count={3} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Market item skeleton styles
  marketListContainer: {
    paddingHorizontal: theme.spacing.lg,
  },
  marketItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.xs,
    minHeight: theme.components.listItem.height,
  },
  rankSkeleton: {
    marginRight: theme.spacing.md,
  },
  iconSkeleton: {
    marginRight: theme.spacing.md,
  },
  coinInfoSkeleton: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  nameSkeleton: {
    marginBottom: 6,
  },
  symbolSkeleton: {},
  chartSkeleton: {
    marginHorizontal: theme.spacing.sm,
  },
  priceSectionSkeleton: {
    alignItems: 'flex-end',
    minWidth: 100,
  },
  priceSkeleton: {
    marginBottom: 6,
  },
  changeSkeleton: {},

  // Holding item skeleton styles
  holdingsListContainer: {
    gap: theme.spacing.sm,
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  holdingIconSkeleton: {
    marginRight: theme.spacing.md,
  },
  holdingInfoSkeleton: {
    flex: 1,
  },
  holdingNameSkeleton: {
    marginBottom: 6,
  },
  holdingQuantitySkeleton: {},
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValueSkeleton: {
    marginBottom: 6,
  },
  holdingPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  holdingPriceSkeleton: {},

  // Balance card skeleton styles
  balanceCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  balanceLabelSkeleton: {
    marginBottom: theme.spacing.sm,
  },
  balanceValueSkeleton: {
    marginBottom: theme.spacing.sm,
  },
  balanceChangeSkeleton: {},

  // Portfolio skeleton styles
  portfolioContainer: {
    padding: theme.spacing.lg,
  },
  sectionTitleSkeleton: {
    marginBottom: theme.spacing.lg,
  },
});

export default {
  MarketItemSkeleton,
  MarketListSkeleton,
  HoldingItemSkeleton,
  HoldingsListSkeleton,
  BalanceCardSkeleton,
  PortfolioSkeleton,
};
