import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import theme from '../theme/theme';

export default function PortfolioScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: currentTheme.background.primary }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.balanceCard}>
        <Text style={[styles.balanceLabel, { color: currentTheme.text.secondary }]}>
          Total Balance
        </Text>
        <Text style={[styles.balanceValue, { color: currentTheme.text.primary }]}>
          $0.00
        </Text>
        <Text style={[styles.balanceChange, { color: currentTheme.indicators?.positive || theme.colors.indicators.positive }]}>
          +0.00% today
        </Text>
      </View>

      <View style={styles.emptyState}>
        <Text style={[styles.emptyTitle, { color: currentTheme.text.primary }]}>
          No Assets Yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: currentTheme.text.secondary }]}>
          Link your exchange accounts or add holdings manually to track your portfolio.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
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
});
