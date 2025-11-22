import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { getFearGreedIndex } from '../apis/coinGeckoAPI';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

const FearGreedIndex = () => {
  const [fearGreedData, setFearGreedData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  useEffect(() => {
    fetchFearGreedData();
  }, []);

  const fetchFearGreedData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getFearGreedIndex();
      if (data && data.data && data.data.length > 0) {
        setFearGreedData(data.data[0]);
      } else {
        setError('No data available');
      }
    } catch (err) {
      setError('Failed to fetch Fear & Greed Index');
      console.error('Fear & Greed Index error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorForValue = (value) => {
    if (value <= 25) return '#F87171'; // Red for Extreme Fear
    if (value <= 45) return '#FB923C'; // Orange for Fear
    if (value <= 55) return '#FCD34D'; // Yellow for Neutral
    if (value <= 75) return '#84CC16'; // Light Green for Greed
    return '#22C55E'; // Green for Extreme Greed
  };

  const getClassificationColor = (classification) => {
    const colors = {
      'Extreme Fear': '#F87171',
      'Fear': '#FB923C',
      'Neutral': '#FCD34D',
      'Greed': '#84CC16',
      'Extreme Greed': '#22C55E'
    };
    return colors[classification] || '#9CA3AF';
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.background.secondary }]}>
        <Text style={[styles.title, { color: currentTheme.text.primary }]}>Fear & Greed Index</Text>
        <Text style={[styles.loadingText, { color: currentTheme.text.secondary }]}>Loading...</Text>
      </View>
    );
  }

  if (error || !fearGreedData) {
    return (
      <View style={[styles.container, { backgroundColor: currentTheme.background.secondary }]}>
        <Text style={[styles.title, { color: currentTheme.text.primary }]}>Fear & Greed Index</Text>
        <Text style={[styles.errorText, { color: currentTheme.indicators?.negative || theme.colors.indicators.negative }]}>
          {error || 'No data available'}
        </Text>
      </View>
    );
  }

  const value = parseInt(fearGreedData.value);
  const classification = fearGreedData.value_classification;
  const color = getColorForValue(value);
  const classificationColor = getClassificationColor(classification);

  // Circle properties
  const size = 80;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background.secondary }]}>
      <Text style={[styles.title, { color: currentTheme.text.primary }]}>Fear & Greed Index</Text>
      
      <View style={styles.indexContainer}>
        <View style={styles.circleContainer}>
          <Svg width={size} height={size} style={styles.svg}>
            {/* Background circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={color}
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          </Svg>
          
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color: currentTheme.text.primary }]}>{value}</Text>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.classification, { color: classificationColor }]}>
            {classification}
          </Text>
          <Text style={[styles.subtitle, { color: currentTheme.text.muted }]}>
            Market Sentiment
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    ...theme.shadows.subtle,
  },
  title: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  indexContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    transform: [{ rotate: '0deg' }],
  },
  valueContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontSize: 24,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing.lg,
    justifyContent: 'center',
  },
  classification: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
  },
  loadingText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
  errorText: {
    fontSize: theme.typography.sizes.caption,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
    paddingVertical: theme.spacing.lg,
  },
});

export default FearGreedIndex;