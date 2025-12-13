import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

export default function WatchlistScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const handleConnectWallet = () => {
    console.log('Connect Wallet pressed - will implement QR scanning later');
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: currentTheme.background.secondary }]}>
          <Ionicons 
            name="wallet-outline" 
            size={48} 
            color={currentTheme.brand?.primary || theme.colors.brand.primary} 
          />
        </View>
        <Text style={[styles.title, { color: currentTheme.text.primary }]}>
          Portfolio
        </Text>
        <Text style={[styles.subtext, { color: currentTheme.text.secondary }]}>
          Link your wallet to track your gains
        </Text>
      </View>

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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.sm,
  },
  subtext: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
  },
  buttonSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
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
