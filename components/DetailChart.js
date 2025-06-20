import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Polyline, Circle } from 'react-native-svg';
import { getCoinHistoricalData } from '../apis/coinGeckoAPI';
import theme from '../theme';

const { width } = Dimensions.get('window');

const DetailChart = ({ coinId }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const timePeriods = [
    { label: '1D', value: '1' },
    { label: '1W', value: '7' },
    { label: '1M', value: '30' },
    { label: '1Y', value: '365' },
    { label: '5Y', value: '1825' },
  ];

  useEffect(() => {
    fetchChartData();
  }, [coinId, selectedPeriod]);

  const fetchChartData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add a small delay to avoid rapid successive calls
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const data = await getCoinHistoricalData(coinId, selectedPeriod);
      
      if (data && data.prices && data.prices.length > 0) {
        const formattedData = data.prices.map((price, index) => ({
          x: index,
          y: price[1], // price[1] is the price value, price[0] is timestamp
          timestamp: price[0],
        }));
        setChartData(formattedData);
      } else {
        setError('No chart data available');
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Rate limit reached. Please wait a moment.');
      } else {
        setError('Failed to load chart data');
      }
      console.error('Chart data error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return null;
    }

    // Chart dimensions
    const chartWidth = width - theme.spacing.lg * 4; // Account for padding
    const chartHeight = 200;
    const padding = 20;

    // Calculate min/max for scaling
    const prices = chartData.map(d => d.y);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Convert data to SVG points
    const points = chartData.map((item, index) => {
      const x = padding + (index / (chartData.length - 1)) * (chartWidth - 2 * padding);
      const y = chartHeight - padding - ((item.y - minPrice) / priceRange) * (chartHeight - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    // Determine if price is going up or down overall
    const firstPrice = chartData[0]?.y || 0;
    const lastPrice = chartData[chartData.length - 1]?.y || 0;
    const priceChange = lastPrice - firstPrice;
    
    const chartColor = priceChange >= 0 
      ? theme.colors.indicators.positive 
      : theme.colors.indicators.negative;

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          <Polyline
            points={points}
            fill="none"
            stroke={chartColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Add a dot at the end point */}
          {chartData.length > 0 && (
            <Circle
              cx={padding + (chartWidth - 2 * padding)}
              cy={chartHeight - padding - ((lastPrice - minPrice) / priceRange) * (chartHeight - 2 * padding)}
              r="3"
              fill={chartColor}
            />
          )}
        </Svg>
      </View>
    );
  };

  const renderTimePeriodButtons = () => (
    <View style={styles.periodContainer}>
      {timePeriods.map((period) => (
        <TouchableOpacity
          key={period.value}
          style={[
            styles.periodButton,
            selectedPeriod === period.value && styles.selectedPeriod,
          ]}
          onPress={() => setSelectedPeriod(period.value)}
        >
          <Text
            style={[
              styles.periodText,
              selectedPeriod === period.value && styles.selectedPeriodText,
            ]}
          >
            {period.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading chart...</Text>
        </View>
        {renderTimePeriodButtons()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
        {renderTimePeriodButtons()}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderChart()}
      {renderTimePeriodButtons()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.lg,
  },
  chartContainer: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  },
  errorText: {
    color: theme.colors.indicators.negative,
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  },
  periodContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
  },
  periodButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  selectedPeriod: {
    backgroundColor: theme.colors.brand.primary,
  },
  periodText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  selectedPeriodText: {
    color: theme.colors.text.primary,
    fontWeight: theme.typography.weights.semibold,
  },
});

export default DetailChart;