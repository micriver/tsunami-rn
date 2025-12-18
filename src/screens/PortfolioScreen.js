import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import theme from '../theme/theme';

export default function PortfolioScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const handleConnectWallet = () => {
    console.log('Connect Wallet pressed - will implement QR scanning later');
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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
