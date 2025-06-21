import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Linking,
  Alert,
} from "react-native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import theme from "../theme";

const SettingsScreen = ({ onClose, onLogout, isDarkMode, onThemeToggle }) => {
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  const currentIndicators = isDarkMode
    ? theme.colors.dark.indicators
    : theme.colors.indicators;
  const currentBrand = isDarkMode
    ? theme.colors.dark.brand
    : theme.colors.brand;
  const currentAccent = isDarkMode
    ? theme.colors.dark.accent
    : theme.colors.accent;

  const handleWebsitePress = () => {
    const websiteUrl = "https://github.com/micriver/tsunami-rn";
    Alert.alert("Visit Repository", `This would open ${websiteUrl}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open",
        onPress: () =>
          Linking.openURL(websiteUrl).catch(() => {
            Alert.alert("Error", "Could not open link");
          }),
      },
    ]);
  };

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

  const SettingsItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    rightComponent,
  }) => (
    <TouchableOpacity
      style={[
        styles.settingsItem,
        { backgroundColor: currentTheme.background.secondary },
      ]}
      onPress={onPress}
    >
      <View style={styles.settingsItemLeft}>
        <MaterialIcons
          name={icon}
          size={24}
          color={currentTheme.text.secondary}
          style={styles.settingsIcon}
        />
        <View style={styles.settingsTextContainer}>
          <Text
            style={[styles.settingsTitle, { color: currentTheme.text.primary }]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.settingsSubtitle,
                { color: currentTheme.text.secondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <MaterialIcons
            name='chevron-right'
            size={24}
            color={currentTheme.text.muted}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentTheme.background.primary },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: currentTheme.background.primary,
            borderBottomColor: currentTheme.background.tertiary,
          },
        ]}
      >
        <Text
          style={[styles.headerTitle, { color: currentTheme.text.primary }]}
        >
          Settings
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.closeButton,
            { backgroundColor: currentTheme.background.secondary },
          ]}
        >
          <MaterialIcons
            name='close'
            size={28}
            color={currentTheme.text.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Info Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.text.secondary },
            ]}
          >
            Account
          </Text>

          <SettingsItem
            icon='person'
            title='Username'
            subtitle='crypto_trader_2024'
            onPress={() => {}}
          />

          <SettingsItem
            icon='attach-money'
            title='Preferred Currency'
            subtitle='USD ($)'
            onPress={() => {}}
          />

          <SettingsItem
            icon='star'
            title='Watchlist'
            subtitle='12 coins tracked'
            onPress={() => {}}
          />
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.text.secondary },
            ]}
          >
            Actions
          </Text>

          <TouchableOpacity
            style={[
              styles.settingsItem,
              styles.logoutItem,
              {
                backgroundColor: currentTheme.background.secondary,
                borderColor: currentIndicators.negative + "20",
              },
            ]}
            onPress={onLogout}
          >
            <View style={styles.settingsItemLeft}>
              <MaterialIcons
                name='logout'
                size={24}
                color={currentIndicators.negative}
                style={styles.settingsIcon}
              />
              <Text
                style={[
                  styles.settingsTitle,
                  { color: currentIndicators.negative },
                ]}
              >
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionTitle,
              { color: currentTheme.text.secondary },
            ]}
          >
            About
          </Text>

          <SettingsItem
            icon='language'
            title='Repository'
            subtitle='github.com/micriver/tsunami-rn'
            onPress={handleWebsitePress}
          />

          <SettingsItem
            icon='info'
            title='App Version'
            subtitle='1.0.0'
            onPress={() => {}}
            showArrow={false}
          />

          <SettingsItem icon='help' title='Help & Support' onPress={() => {}} />

          <SettingsItem
            icon='privacy-tip'
            title='Privacy Policy'
            onPress={() => {}}
          />
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      
      {/* Social Footer */}
      <View style={[styles.socialFooter, { backgroundColor: currentTheme.background.secondary }]}>
        <View style={styles.socialContent}>
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: currentTheme.background.primary }]}
              onPress={() => handleSocialPress('twitter')}
            >
              <FontAwesome 
                name="twitter" 
                size={16} 
                color={currentAccent?.orange || theme.colors.accent.orange} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.socialButton, { backgroundColor: currentTheme.background.primary }]}
              onPress={() => handleSocialPress('instagram')}
            >
              <FontAwesome 
                name="instagram" 
                size={16} 
                color={currentAccent?.orange || theme.colors.accent.orange} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background.tertiary,
  },
  headerTitle: {
    fontSize: theme.typography.sizes.h1,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  closeButton: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.md,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semibold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.subtle,
  },
  settingsItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingsItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsIcon: {
    marginRight: theme.spacing.md,
  },
  settingsTextContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  settingsSubtitle: {
    fontSize: theme.typography.sizes.small,
    marginTop: 2,
    fontFamily: theme.typography.fontFamily,
  },
  logoutItem: {
    borderWidth: 1,
    borderColor: theme.colors.indicators.negative + "20",
  },
  bottomSpacing: {
    height: theme.spacing.xxxl,
  },
  socialFooter: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  socialContent: {
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

export default SettingsScreen;
