import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../theme';
import { useTheme } from '../context/ThemeContext';

const SocialFooter = () => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const handleSocialPress = (platform) => {
    const urls = {
      twitter: 'https://twitter.com/tsunami_crypto',
      instagram: 'https://instagram.com/tsunami_crypto',
    };

    Alert.alert(
      `Open ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
      `This would open ${urls[platform]}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open', 
          onPress: () => Linking.openURL(urls[platform]).catch(() => {
            Alert.alert('Error', 'Could not open link');
          })
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.secondary }]}>
      <View style={styles.content}>
        <Text style={[styles.footerText, { color: currentTheme.text.muted }]}>
          Follow us for crypto updates
        </Text>
        <View style={styles.socialButtons}>
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: currentTheme.background.primary }]}
            onPress={() => handleSocialPress('twitter')}
          >
            <MaterialIcons 
              name="close" 
              size={16} 
              color={currentTheme.accent?.orange || theme.colors.accent.orange} 
            />
            <Text style={[styles.socialButtonText, { color: currentTheme.text.primary }]}>X</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.socialButton, { backgroundColor: currentTheme.background.primary }]}
            onPress={() => handleSocialPress('instagram')}
          >
            <MaterialIcons 
              name="camera-alt" 
              size={16} 
              color={currentTheme.accent?.orange || theme.colors.accent.orange} 
            />
            <Text style={[styles.socialButtonText, { color: currentTheme.text.primary }]}>IG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium,
    marginBottom: theme.spacing.sm,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.xs,
    ...theme.shadows.subtle,
  },
  socialButtonText: {
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.semibold,
  },
});

export default SocialFooter;