import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Svg, { Polyline, Circle, Line, Text as SvgText, Defs, LinearGradient, Stop, Path } from "react-native-svg";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { getCoinHistoricalData } from "../apis/coinGeckoAPI";
import theme from "../theme/theme";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

const DetailChart = ({ coinId }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrubData, setScrubData] = useState(null);
  const { isDarkMode } = useTheme();

  // Shared values for gesture handling
  const isActive = useSharedValue(false);
  const tooltipOpacity = useSharedValue(0);

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

  // Chart dimensions - defined at component level for gesture handling
  const chartWidth = width - theme.spacing.lg * 4;
  const chartHeight = 200;
  const padding = 20;

  // Calculate chart data points for scrubbing
  const getChartMetrics = useCallback(() => {
    if (!chartData || chartData.length === 0) {
      return { minPrice: 0, maxPrice: 0, priceRange: 1 };
    }
    const prices = chartData.map((d) => d.y);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;
    return { minPrice, maxPrice, priceRange };
  }, [chartData]);

  // Find the closest data point to a given X position
  const findClosestDataPoint = useCallback(
    (touchX) => {
      if (!chartData || chartData.length === 0) return null;

      const { minPrice, priceRange } = getChartMetrics();

      // Convert touch X to data index
      const chartAreaWidth = chartWidth - 2 * padding;
      const relativeX = touchX - padding;
      const ratio = Math.max(0, Math.min(1, relativeX / chartAreaWidth));
      const index = Math.round(ratio * (chartData.length - 1));
      const clampedIndex = Math.max(0, Math.min(chartData.length - 1, index));

      const dataPoint = chartData[clampedIndex];
      const x =
        padding +
        (clampedIndex / (chartData.length - 1)) * chartAreaWidth;
      const y =
        chartHeight -
        padding -
        ((dataPoint.y - minPrice) / priceRange) * (chartHeight - 2 * padding);

      return {
        index: clampedIndex,
        x,
        y,
        price: dataPoint.y,
        timestamp: dataPoint.timestamp,
      };
    },
    [chartData, chartWidth, chartHeight, padding, getChartMetrics]
  );

  // Update scrub data from gesture (runs on JS thread)
  const updateScrubData = useCallback(
    (touchX) => {
      const point = findClosestDataPoint(touchX);
      setScrubData(point);
    },
    [findClosestDataPoint]
  );

  // Clear scrub data
  const clearScrubData = useCallback(() => {
    setScrubData(null);
  }, []);

  // Format timestamp for tooltip
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options =
      selectedPeriod === "1"
        ? { hour: "numeric", minute: "2-digit" }
        : { month: "short", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  // Format price for tooltip
  const formatPrice = (price) => {
    return `$${price.toLocaleString(undefined, {
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    })}`;
  };

  // Create pan gesture for scrubbing
  const panGesture = Gesture.Pan()
    .onStart((event) => {
      isActive.value = true;
      tooltipOpacity.value = withTiming(1, { duration: 150 });
      runOnJS(updateScrubData)(event.x);
    })
    .onUpdate((event) => {
      runOnJS(updateScrubData)(event.x);
    })
    .onEnd(() => {
      isActive.value = false;
      tooltipOpacity.value = withTiming(0, { duration: 200 });
      runOnJS(clearScrubData)();
    })
    .onFinalize(() => {
      isActive.value = false;
      tooltipOpacity.value = withTiming(0, { duration: 200 });
      runOnJS(clearScrubData)();
    });

  // Animated style for tooltip
  const tooltipAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
  }));

  const renderChart = () => {
    if (!chartData || chartData.length === 0) {
      return null;
    }

    // Calculate min/max for scaling
    const { minPrice, maxPrice, priceRange } = getChartMetrics();

    // Determine if price is going up or down overall
    const firstPrice = chartData[0]?.y || 0;
    const lastPrice = chartData[chartData.length - 1]?.y || 0;
    const priceChange = lastPrice - firstPrice;

    const chartColor =
      priceChange >= 0
        ? currentTheme.indicators?.positive || theme.colors.indicators.positive
        : currentTheme.indicators?.negative || theme.colors.indicators.negative;

    // Convert data to SVG points for line
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

    // Create path data for gradient fill (closed path from line to bottom)
    const pathPoints = chartData.map((item, index) => {
      const x =
        padding +
        (index / (chartData.length - 1)) * (chartWidth - 2 * padding);
      const y =
        chartHeight -
        padding -
        ((item.y - minPrice) / priceRange) * (chartHeight - 2 * padding);
      return { x, y };
    });

    // Build SVG path: start from first point, line through all points, then close at bottom
    const firstPoint = pathPoints[0];
    const lastPoint = pathPoints[pathPoints.length - 1];
    const bottomY = chartHeight - padding;

    let pathD = `M ${firstPoint.x} ${firstPoint.y}`;
    for (let i = 1; i < pathPoints.length; i++) {
      pathD += ` L ${pathPoints[i].x} ${pathPoints[i].y}`;
    }
    // Close the path by going to bottom right, then bottom left, then back to start
    pathD += ` L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;

    // Unique gradient ID based on price change direction
    const gradientId = priceChange >= 0 ? "positiveGradient" : "negativeGradient";

    const gridColor = isDarkMode
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.1)";
    const labelColor =
      currentTheme.text?.secondary || theme.colors.text.secondary;

    return (
      <GestureDetector gesture={panGesture}>
        <View
          style={[
            styles.chartContainer,
            { backgroundColor: currentTheme.background.secondary },
          ]}
        >
          <View style={styles.chartWrapper}>
            <Svg width={chartWidth} height={chartHeight}>
              {/* Gradient definitions */}
              <Defs>
                <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor={chartColor} stopOpacity="0.3" />
                  <Stop offset="1" stopColor={chartColor} stopOpacity="0" />
                </LinearGradient>
              </Defs>

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

              {/* Gradient fill below line */}
              <Path
                d={pathD}
                fill={`url(#${gradientId})`}
              />

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

              {/* End point dot (hide when scrubbing) */}
              {chartData.length > 0 && !scrubData && (
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

              {/* Scrub indicator line */}
              {scrubData && (
                <>
                  <Line
                    x1={scrubData.x}
                    y1={padding}
                    x2={scrubData.x}
                    y2={chartHeight - padding}
                    stroke={chartColor}
                    strokeWidth='1'
                    strokeDasharray='4,4'
                  />
                  <Circle
                    cx={scrubData.x}
                    cy={scrubData.y}
                    r='6'
                    fill={chartColor}
                  />
                  <Circle
                    cx={scrubData.x}
                    cy={scrubData.y}
                    r='3'
                    fill={isDarkMode ? "#ffffff" : "#000000"}
                  />
                </>
              )}
            </Svg>

            {/* Tooltip overlay */}
            {scrubData && (
              <Animated.View
                style={[
                  styles.tooltip,
                  tooltipAnimatedStyle,
                  {
                    left: Math.min(
                      Math.max(scrubData.x - 50, 0),
                      chartWidth - 100
                    ),
                    top: 0,
                    backgroundColor: isDarkMode
                      ? "rgba(255, 255, 255, 0.95)"
                      : "rgba(0, 0, 0, 0.85)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tooltipPrice,
                    { color: isDarkMode ? "#000000" : "#ffffff" },
                  ]}
                >
                  {formatPrice(scrubData.price)}
                </Text>
                <Text
                  style={[
                    styles.tooltipDate,
                    {
                      color: isDarkMode
                        ? "rgba(0, 0, 0, 0.7)"
                        : "rgba(255, 255, 255, 0.7)",
                    },
                  ]}
                >
                  {formatDate(scrubData.timestamp)}
                </Text>
              </Animated.View>
            )}
          </View>
        </View>
      </GestureDetector>
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
  chartWrapper: {
    position: "relative",
  },
  tooltip: {
    position: "absolute",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    minWidth: 100,
    alignItems: "center",
  },
  tooltipPrice: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  tooltipDate: {
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
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
