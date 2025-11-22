import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

export default function NewsScreen() {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.primary }]}>
      <Text style={[styles.text, { color: currentTheme.text.primary }]}>
        Latest News
      </Text>
      <Text style={[styles.subtext, { color: currentTheme.text.secondary }]}>
        Stay updated with the latest crypto news.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: theme.typography.sizes.h2,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.sm,
  },
  subtext: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  }
});
