import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Polyline, Circle, Line, Text as SvgText } from "react-native-svg";
import { getCoinHistoricalData } from "../apis/coinGeckoAPI";
import theme from "../theme";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

const DetailChart = ({ coinId }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDarkMode } = useTheme();

  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;

  const timePeriods = [
    { label: "1D", value: "1" },
    { label: "1W", value: "7" },
    { label: "1M", value: "30" },
    { label: "1Y", value: "365" },
    { label: "5Y", value: "1825" },
  ];

  useEffect(() => {
    fetchChartData();
  }, [coinId, selectedPeriod]);

  const fetchChartData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Add a small delay to avoid rapid successive calls
      await new Promise((resolve) => setTimeout(resolve, 100));

      const data = await getCoinHistoricalData(coinId, selectedPeriod);

      if (data && data.prices && data.prices.length > 0) {
        const formattedData = data.prices.map((price, index) => ({
          x: index,
          y: price[1], // price[1] is the price value, price[0] is timestamp
          timestamp: price[0],
        }));
        setChartData(formattedData);
      } else {
        setError("No chart data available");
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError("Rate limit reached. Please wait a moment.");
      } else {
        setError("Failed to load chart data");
      }
      console.error("Chart data error:", err);
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
    const prices = chartData.map((d) => d.y);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    // Convert data to SVG points
    const points = chartData
      .map((item, index) => {
        const x =
          padding +
          (index / (chartData.length - 1)) * (chartWidth - 2 * padding);
        const y =
          chartHeight -
          padding -
          ((item.y - minPrice) / priceRange) * (chartHeight - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");

    // Determine if price is going up or down overall
    const firstPrice = chartData[0]?.y || 0;
    const lastPrice = chartData[chartData.length - 1]?.y || 0;
    const priceChange = lastPrice - firstPrice;

    const chartColor =
      priceChange >= 0
        ? currentTheme.indicators?.positive || theme.colors.indicators.positive
        : currentTheme.indicators?.negative || theme.colors.indicators.negative;

    const gridColor = isDarkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";
    const labelColor =
      currentTheme.text?.secondary || theme.colors.text.secondary;

    return (
      <View
        style={[
          styles.chartContainer,
          { backgroundColor: currentTheme.background.secondary },
        ]}
      >
        <Svg width={chartWidth} height={chartHeight}>
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding + ratio * (chartHeight - 2 * padding);
            return (
              <Line
                key={`hgrid-${index}`}
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke={gridColor}
                strokeWidth='0.5'
                opacity='0.5'
              />
            );
          })}

          {/* Vertical grid lines */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((ratio, index) => {
            const x = padding + ratio * (chartWidth - 2 * padding);
            return (
              <Line
                key={`vgrid-${index}`}
                x1={x}
                y1={padding}
                x2={x}
                y2={chartHeight - padding}
                stroke={gridColor}
                strokeWidth='0.5'
                opacity='0.5'
              />
            );
          })}

          {/* Chart line */}
          <Polyline
            points={points}
            fill='none'
            stroke={chartColor}
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {/* Y-axis price labels */}
          {[0, 0.5, 1].map((ratio, index) => {
            const y = padding + ratio * (chartHeight - 2 * padding);
            const price = maxPrice - ratio * priceRange;
            return (
              <SvgText
                key={`ylabel-${index}`}
                x={5}
                y={y + 3}
                fontSize='10'
                fill={labelColor}
                textAnchor='start'
              >
                $
                {price.toLocaleString(undefined, {
                  minimumFractionDigits: price < 1 ? 4 : 2,
                  maximumFractionDigits: price < 1 ? 4 : 2,
                })}
              </SvgText>
            );
          })}

          {/* End point dot */}
          {chartData.length > 0 && (
            <Circle
              cx={padding + (chartWidth - 2 * padding)}
              cy={
                chartHeight -
                padding -
                ((lastPrice - minPrice) / priceRange) *
                  (chartHeight - 2 * padding)
              }
              r='3'
              fill={chartColor}
            />
          )}
        </Svg>
      </View>
    );
  };

  const renderTimePeriodButtons = () => (
    <View
      style={[
        styles.periodContainer,
        { backgroundColor: currentTheme.background.secondary },
      ]}
    >
      {timePeriods.map((period) => (
        <TouchableOpacity
          key={period.value}
          style={[
            styles.periodButton,
            selectedPeriod === period.value && [
              styles.selectedPeriod,
              {
                backgroundColor:
                  currentTheme.brand?.primary || theme.colors.brand.primary,
              },
            ],
          ]}
          onPress={() => setSelectedPeriod(period.value)}
        >
          <Text
            style={[
              [styles.periodText, { color: currentTheme.text.secondary }],
              selectedPeriod === period.value && [
                styles.selectedPeriodText,
                {
                  color: "#ffffff",
                },
              ],
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
        <View
          style={[
            styles.loadingContainer,
            { backgroundColor: currentTheme.background.secondary },
          ]}
        >
          <Text
            style={[styles.loadingText, { color: currentTheme.text.secondary }]}
          >
            Loading chart...
          </Text>
        </View>
        {renderTimePeriodButtons()}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.errorContainer,
            { backgroundColor: currentTheme.background.secondary },
          ]}
        >
          <Text
            style={[
              styles.errorText,
              {
                color:
                  currentTheme.indicators?.negative ||
                  theme.colors.indicators.negative,
              },
            ]}
          >
            {error}
          </Text>
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
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    ...theme.shadows.subtle,
  },
  loadingContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  errorContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  },
  errorText: {
    fontSize: theme.typography.sizes.body,
    fontFamily: theme.typography.fontFamily,
  },
  periodContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xs,
  },
  periodButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  selectedPeriod: {
    // Background color will be set dynamically
  },
  periodText: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  selectedPeriodText: {
    fontWeight: theme.typography.weights.semibold,
  },
});

export default DetailChart;
