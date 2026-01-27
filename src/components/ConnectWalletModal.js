import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import theme from '../theme/theme';

// Wallet options with icons
const WALLET_OPTIONS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
    iconFallback: 'wallet',
    description: 'Connect using browser wallet',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'https://avatars.githubusercontent.com/u/37784886',
    iconFallback: 'qr-code',
    description: 'Scan with mobile wallet',
  },
  {
    id: 'coinbase',
    name: 'Coinbase Wallet',
    icon: 'https://avatars.githubusercontent.com/u/18060234',
    iconFallback: 'card',
    description: 'Connect Coinbase Wallet',
  },
];

const WalletOption = ({ wallet, currentTheme, onPress }) => {
  const [imageError, setImageError] = React.useState(false);

  return (
    <TouchableOpacity
      style={[styles.walletOption, { backgroundColor: currentTheme.background.secondary }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.walletIconContainer, { backgroundColor: currentTheme.background.tertiary }]}>
        {!imageError ? (
          <Image
            source={{ uri: wallet.icon }}
            style={styles.walletIcon}
            onError={() => setImageError(true)}
          />
        ) : (
          <Ionicons
            name={wallet.iconFallback}
            size={28}
            color={currentTheme.brand?.primary || theme.colors.brand.primary}
          />
        )}
      </View>
      <View style={styles.walletInfo}>
        <Text style={[styles.walletName, { color: currentTheme.text.primary }]}>
          {wallet.name}
        </Text>
        <Text style={[styles.walletDescription, { color: currentTheme.text.secondary }]}>
          {wallet.description}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={currentTheme.text.muted}
      />
    </TouchableOpacity>
  );
};

export default function ConnectWalletModal({ visible, onClose }) {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const handleWalletSelect = (walletId) => {
    console.log(`Selected wallet: ${walletId} - Coming soon!`);
    // Placeholder - wallet connection will be implemented later
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: currentTheme.background.primary }]}>
              {/* Handle bar */}
              <View style={[styles.handleBar, { backgroundColor: currentTheme.text.muted }]} />

              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: currentTheme.text.primary }]}>
                  Connect Wallet
                </Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={currentTheme.text.secondary}
                  />
                </TouchableOpacity>
              </View>

              {/* Description */}
              <Text style={[styles.description, { color: currentTheme.text.secondary }]}>
                Choose a wallet to connect to Tsunami
              </Text>

              {/* Wallet options */}
              <View style={styles.walletList}>
                {WALLET_OPTIONS.map((wallet) => (
                  <WalletOption
                    key={wallet.id}
                    wallet={wallet}
                    currentTheme={currentTheme}
                    onPress={() => handleWalletSelect(wallet.id)}
                  />
                ))}
              </View>

              {/* Footer note */}
              <View style={styles.footer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color={currentTheme.text.muted}
                />
                <Text style={[styles.footerText, { color: currentTheme.text.muted }]}>
                  Your keys stay safe in your wallet
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
    paddingTop: theme.spacing.md,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  description: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xl,
  },
  walletList: {
    gap: theme.spacing.md,
  },
  walletOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.subtle,
  },
  walletIconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  walletIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.sm,
  },
  walletInfo: {
    flex: 1,
  },
  walletName: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    marginBottom: 2,
  },
  walletDescription: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  footerText: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
  },
});
