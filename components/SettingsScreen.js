import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../theme';

const SettingsScreen = ({ onClose, onLogout, isDarkMode, onThemeToggle }) => {
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const SettingsItem = ({ icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
      <View style={styles.settingsItemLeft}>
        <MaterialIcons name={icon} size={24} color={currentTheme.text.secondary} style={styles.settingsIcon} />
        <View style={styles.settingsTextContainer}>
          <Text style={[styles.settingsTitle, { color: currentTheme.text.primary }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingsSubtitle, { color: currentTheme.text.secondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingsItemRight}>
        {rightComponent}
        {showArrow && !rightComponent && (
          <MaterialIcons name="chevron-right" size={24} color={currentTheme.text.muted} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentTheme.background.primary }]}>
        <Text style={[styles.headerTitle, { color: currentTheme.text.primary }]}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="close" size={28} color={currentTheme.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text.secondary }]}>Appearance</Text>
          
          <SettingsItem
            icon="brightness-6"
            title="Dark Mode"
            subtitle={isDarkMode ? "Dark theme enabled" : "Light theme enabled"}
            showArrow={false}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={onThemeToggle}
                trackColor={{
                  false: '#767577',
                  true: theme.colors.brand.primary,
                }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor="#3e3e3e"
              />
            }
          />
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text.secondary }]}>About</Text>
          
          <SettingsItem
            icon="info"
            title="App Version"
            subtitle="1.0.0"
            onPress={() => {}}
            showArrow={false}
          />
          
          <SettingsItem
            icon="help"
            title="Help & Support"
            onPress={() => {}}
          />
          
          <SettingsItem
            icon="privacy-tip"
            title="Privacy Policy"
            onPress={() => {}}
          />
        </View>

        {/* Account Actions Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.text.secondary }]}>Account</Text>
          
          <TouchableOpacity 
            style={[styles.settingsItem, styles.logoutItem]} 
            onPress={onLogout}
          >
            <View style={styles.settingsItemLeft}>
              <MaterialIcons 
                name="logout" 
                size={24} 
                color={theme.colors.indicators.negative} 
                style={styles.settingsIcon} 
              />
              <Text style={[styles.settingsTitle, { color: theme.colors.indicators.negative }]}>
                Log Out
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxxl + theme.spacing.lg,
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
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.sm,
    ...theme.shadows.subtle,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: theme.colors.indicators.negative + '20',
  },
  bottomSpacing: {
    height: theme.spacing.xxxl,
  },
});

export default SettingsScreen;