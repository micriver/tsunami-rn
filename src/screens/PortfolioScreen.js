import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import theme from '../theme/theme';

// Demo holdings data
const DEMO_HOLDINGS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579',
    quantity: 0.5,
    currentPrice: 42500,
    priceChange24h: 2.34,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    quantity: 3.2,
    currentPrice: 2250,
    priceChange24h: -1.15,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png?1640133422',
    quantity: 25,
    currentPrice: 98.50,
    priceChange24h: 5.67,
  },
];

// Calculate total value for a holding
const calculateHoldingValue = (holding) => holding.quantity * holding.currentPrice;

// Calculate total portfolio value
const calculateTotalValue = (holdings) =>
  holdings.reduce((total, h) => total + calculateHoldingValue(h), 0);

// Calculate weighted average 24h change
const calculateTotalChange = (holdings) => {
  const totalValue = calculateTotalValue(holdings);
  if (totalValue === 0) return 0;
  return holdings.reduce((acc, h) => {
    const holdingValue = calculateHoldingValue(h);
    const weight = holdingValue / totalValue;
    return acc + (h.priceChange24h * weight);
  }, 0);
};

// Format currency
const formatCurrency = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  } else if (value >= 1000) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `$${value.toFixed(2)}`;
  }
};

// Format price for display
const formatPrice = (price) => {
  if (price >= 1000) {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else if (price >= 1) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price.toFixed(4)}`;
  }
};

// Individual holding item component
const HoldingItem = ({ holding, currentTheme }) => {
  const totalValue = calculateHoldingValue(holding);
  const isPositive = holding.priceChange24h >= 0;
  const changeColor = isPositive
    ? (currentTheme.indicators?.positive || theme.colors.indicators.positive)
    : (currentTheme.indicators?.negative || theme.colors.indicators.negative);
  const changeBgColor = isPositive
    ? (currentTheme.indicators?.positiveBg || theme.colors.indicators.positiveBg)
    : (currentTheme.indicators?.negativeBg || theme.colors.indicators.negativeBg);

  return (
    <View style={[styles.holdingItem, { backgroundColor: currentTheme.background.secondary }]}>
      <View style={styles.holdingLeft}>
        <Image source={{ uri: holding.image }} style={styles.holdingIcon} />
        <View style={styles.holdingInfo}>
          <Text style={[styles.holdingName, { color: currentTheme.text.primary }]}>
            {holding.name}
          </Text>
          <Text style={[styles.holdingSymbol, { color: currentTheme.text.secondary }]}>
            {holding.quantity} {holding.symbol}
          </Text>
        </View>
      </View>
      <View style={styles.holdingRight}>
        <Text style={[styles.holdingValue, { color: currentTheme.text.primary }]}>
          {formatCurrency(totalValue)}
        </Text>
        <View style={styles.holdingPriceRow}>
          <Text style={[styles.holdingPrice, { color: currentTheme.text.secondary }]}>
            {formatPrice(holding.currentPrice)}
          </Text>
          <View style={[styles.changeIndicator, { backgroundColor: changeBgColor }]}>
            <Text style={[styles.changeText, { color: changeColor }]}>
              {isPositive ? '+' : ''}{holding.priceChange24h.toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function PortfolioScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  const [holdings] = useState(DEMO_HOLDINGS);

  const handleConnectWallet = () => {
    console.log('Connect Wallet pressed - will implement QR scanning later');
  };

  const totalValue = calculateTotalValue(holdings);
  const totalChange = calculateTotalChange(holdings);
  const isPositiveChange = totalChange >= 0;
  const changeColor = isPositiveChange
    ? (currentTheme.indicators?.positive || theme.colors.indicators.positive)
    : (currentTheme.indicators?.negative || theme.colors.indicators.negative);

  // Check if there are holdings to display
  const hasHoldings = holdings.length > 0;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceCard}>
          <Text style={[styles.balanceLabel, { color: currentTheme.text.secondary }]}>
            Total Balance
          </Text>
          <Text style={[styles.balanceValue, { color: currentTheme.text.primary }]}>
            {formatCurrency(totalValue)}
          </Text>
          <Text style={[styles.balanceChange, { color: changeColor }]}>
            {isPositiveChange ? '+' : ''}{totalChange.toFixed(2)}% today
          </Text>
        </View>

        {hasHoldings ? (
          <View style={styles.holdingsSection}>
            <Text style={[styles.sectionTitle, { color: currentTheme.text.primary }]}>
              Holdings
            </Text>
            {holdings.map((holding) => (
              <HoldingItem
                key={holding.id}
                holding={holding}
                currentTheme={currentTheme}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={[styles.iconContainer, { backgroundColor: currentTheme.background.secondary }]}>
              <Ionicons
                name="wallet-outline"
                size={48}
                color={currentTheme.brand?.primary || theme.colors.brand.primary}
              />
            </View>
            <Text style={[styles.emptyTitle, { color: currentTheme.text.primary }]}>
              No Assets Yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: currentTheme.text.secondary }]}>
              Link your wallet to track your gains
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleConnectWallet}
        >
          <Ionicons
            name="scan-outline"
            size={20}
            color="#ffffff"
            style={styles.buttonIcon}
          />
          <Text style={styles.primaryButtonText}>Connect Wallet</Text>
        </TouchableOpacity>
      </View>
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
    padding: theme.spacing.lg,
    flexGrow: 1,
  },
  balanceCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
    marginBottom: theme.spacing.xl,
  },
  balanceLabel: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.xs,
  },
  balanceValue: {
    fontSize: 48,
    fontWeight: theme.typography.weights.bold,
    marginBottom: theme.spacing.xs,
  },
  balanceChange: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
  },
  // Holdings section styles
  holdingsSection: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
  },
  holdingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.subtle,
  },
  holdingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  holdingIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.md,
  },
  holdingInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  holdingName: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
  holdingSymbol: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    marginTop: 2,
  },
  holdingRight: {
    alignItems: 'flex-end',
  },
  holdingValue: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    marginBottom: 4,
  },
  holdingPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  holdingPrice: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    marginRight: theme.spacing.sm,
  },
  changeIndicator: {
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },
  changeText: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  // Empty state styles
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyTitle: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.semibold,
    marginBottom: theme.spacing.sm,
  },
  emptySubtitle: {
    fontSize: theme.typography.sizes.body,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
    lineHeight: 22,
  },
  buttonSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    paddingTop: theme.spacing.lg,
  },
  primaryButton: {
    backgroundColor: theme.colors.accent.orange,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...theme.shadows.subtle,
  },
  buttonIcon: {
    marginRight: theme.spacing.sm,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
});
