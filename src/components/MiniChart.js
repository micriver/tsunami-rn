import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import theme from '../theme/theme';

const MiniChart = ({ sparklineData, priceChange }) => {
  // Handle missing or invalid sparkline data
  if (!sparklineData || !Array.isArray(sparklineData) || sparklineData.length === 0) {
    return <View style={styles.emptyChart} />;
  }

  // Filter out invalid data points
  const validData = sparklineData.filter(price => 
    price !== null && price !== undefined && !isNaN(price) && price > 0
  );

  // If no valid data points, show empty chart
  if (validData.length === 0) {
    return <View style={styles.emptyChart} />;
  }

  // Chart dimensions
  const chartWidth = 60;
  const chartHeight = 30;
  const padding = 2;

  // Calculate min/max for scaling
  const minPrice = Math.min(...validData);
  const maxPrice = Math.max(...validData);
  const priceRange = maxPrice - minPrice || 1; // Avoid division by zero

  // Convert data to SVG points
  const points = validData.map((price, index) => {
    const x = padding + (index / (validData.length - 1)) * (chartWidth - 2 * padding);
    const y = chartHeight - padding - ((price - minPrice) / priceRange) * (chartHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Determine color based on price change
  const chartColor = priceChange >= 0 
    ? theme.colors.indicators.positive 
    : theme.colors.indicators.negative;

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight}>
        <Polyline
          points={points}
          fill="none"
          stroke={chartColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
};

const styles = {
  container: {
    width: 60,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyChart: {
    width: 60,
    height: 30,
    backgroundColor: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.sm,
  },
};

export default MiniChart;