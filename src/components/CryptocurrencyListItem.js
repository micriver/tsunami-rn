import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Alert
} from "react-native";
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from "react";
import theme from "../theme/theme";
import MiniChart from "./MiniChart";
import AnimatedPrice from "./AnimatedPrice";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";

// Component to handle Right Actions (Watch/List) and tracking swipe distance
const SwipeRightActionContent = ({ dragX, isWatched, onSwipeStateChange }) => {
    useEffect(() => {
        const id = dragX.addListener(({ value }) => {
            // value is negative when swiping left
            if (value < -120) {
                onSwipeStateChange(2); // Long
            } else {
                onSwipeStateChange(1); // Short
            }
        });
        return () => dragX.removeListener(id);
    }, [dragX, onSwipeStateChange]);

    const trans = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [0, 100],
    });
    
    // Visual logic
    const opacityList = dragX.interpolate({
        inputRange: [-180, -120], // Fade in list icon
        outputRange: [1, 0],
        extrapolate: 'clamp'
    });
    
    const opacityStar = dragX.interpolate({
        inputRange: [-180, -120], // Fade out star icon
        outputRange: [0, 1],
        extrapolate: 'clamp'
    });
    
    // Background color interpolation
    const backgroundColor = dragX.interpolate({
        inputRange: [-200, -120],
        outputRange: [theme.colors.brand.light, theme.colors.accent.orange],
        extrapolate: 'clamp'
    });

    return (
      <View style={styles.rightActionsContainer}>
         <Animated.View style={[
             styles.rightAction,
             { 
                 backgroundColor: backgroundColor,
                 transform: [{ translateX: trans }],
                 width: '100%'
             }
         ]}>
             {/* Star Icon (Short Swipe) */}
             <Animated.View style={[styles.actionIconContainer, { position: 'absolute', opacity: opacityStar }]}>
                <Ionicons name={isWatched ? "star" : "star-outline"} size={28} color="#ffffff" />
                <Text style={styles.actionText}>{isWatched ? "Unwatch" : "Watch"}</Text>
             </Animated.View>

             {/* List Icon (Long Swipe) */}
             <Animated.View style={[styles.actionIconContainer, { position: 'absolute', opacity: opacityList }]}>
                 <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 50, padding: 8 }}>
                    <Ionicons name="list" size={28} color="#ffffff" />
                 </View>
                <Text style={styles.actionText}>Add to List</Text>
             </Animated.View>
         </Animated.View>
      </View>
    );
};

const CryptocurrencyListItem = ({ currency, index, onPress }) => {
  const { name, symbol, current_price, price_change_24h, image, sparkline_in_7d } = currency;
  const [previousPrice, setPreviousPrice] = useState(current_price);
  const [previousChange, setPreviousChange] = useState(price_change_24h);
  const { isDarkMode } = useTheme();
  const { toggleCoinInList, activeListId, isInWatchlist, addCoinToList, removeCoinFromList } = useWatchlist();
  const isWatched = isInWatchlist(currency.id);
  
  // Get theme colors based on dark mode state
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  
  const changeFlashAnim = useRef(new Animated.Value(0)).current;
  const changeScaleAnim = useRef(new Animated.Value(1)).current;
  
  // Track swipe distance for action logic
  const swipeableRef = useRef(null);
  const swipeActionRef = useRef(0);

  useEffect(() => {
    if (previousPrice !== current_price) {
      setPreviousPrice(current_price);
    }
  }, [current_price]);

  useEffect(() => {
    if (previousChange !== price_change_24h && typeof price_change_24h === 'number') {
      Animated.sequence([
        Animated.timing(changeFlashAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(changeFlashAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]).start();

      Animated.sequence([
        Animated.timing(changeScaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(changeScaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();

      setPreviousChange(price_change_24h);
    }
  }, [price_change_24h]);
  
  const renderLeftActions = (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [0, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
      });
      
      const trans = dragX.interpolate({
          inputRange: [0, 100],
          outputRange: [-100, 0],
      });

      return (
        <View style={styles.leftActionsContainer}>
          <Animated.View
            style={[
                styles.leftAction,
                {
                    backgroundColor: theme.colors.indicators.negative, // Red for trash
                    transform: [{ translateX: trans }],
                }
            ]}
          >
             <Animated.View style={[styles.actionIconContainer, { transform: [{ scale }] }]}>
                <Ionicons name="trash-outline" size={28} color="#ffffff" />
                <Text style={styles.actionText}>Remove</Text>
             </Animated.View>
          </Animated.View>
        </View>
      );
  };

  const handleSwipeOpenWithRef = (direction) => {
      const closeSwipe = () => {
          if (swipeableRef.current) {
              swipeableRef.current.close();
          }
      };

      if (direction === 'left') {
          // Right actions revealed
          if (swipeActionRef.current === 2) {
             // Long swipe -> List Picker
             Alert.alert("Manage Lists", "Add to which list?", [
                { text: "Favorites", onPress: () => addCoinToList('favorites', currency.id) },
                { text: "Watching", onPress: () => addCoinToList('watching', currency.id) },
                { text: "Cancel", style: "cancel" }
             ]);
          } else {
             // Short swipe -> Toggle Watch
             toggleCoinInList(activeListId, currency.id);
          }
          closeSwipe();
      } else if (direction === 'right') {
          if (isWatched) {
             toggleCoinInList(activeListId, currency.id);
          }
          closeSwipe();
      }
  };

  return (
    <Swipeable
        ref={swipeableRef}
        renderRightActions={(progress, dragX) => (
            <SwipeRightActionContent 
                dragX={dragX} 
                isWatched={isWatched} 
                onSwipeStateChange={(state) => swipeActionRef.current = state}
            />
        )}
        renderLeftActions={renderLeftActions}
        onSwipeableOpen={handleSwipeOpenWithRef}
        containerStyle={styles.swipeableContainer}
        overshootRight={false}
        friction={2}
        leftThreshold={80}
        rightThreshold={80}
    >
        <TouchableOpacity onPress={onPress} style={[styles.container, { backgroundColor: currentTheme.background.secondary }]}>
        <View style={styles.item}>
            <View style={styles.leftSection}>
            <Text style={[styles.rankText, { color: currentTheme.text.muted }]}>
                {index + 1}
            </Text>
            <Image source={{ uri: image }} style={styles.coinImage} />
            <View style={styles.coinInfo}>
                <Text style={[styles.coinName, { color: currentTheme.text.primary }]} numberOfLines={1} ellipsizeMode="tail" adjustsFontSizeToFit={true} minimumFontScale={0.7}>{name}</Text>
                <Text style={[styles.coinSymbol, { color: currentTheme.text.secondary }]}>{symbol.toUpperCase()}</Text>
            </View>
            </View>

            <View style={styles.chartSection}>
            <MiniChart 
                sparklineData={sparkline_in_7d?.price || null} 
                priceChange={price_change_24h || 0}
            />
            </View>

            <View style={styles.rightSection}>
            <AnimatedPrice
                price={current_price}
                previousPrice={previousPrice}
                style={[styles.priceText, { 
                color: isDarkMode ? '#ffffff' : '#000000'
                }]}
            />
            <Animated.View 
                style={[
                styles.changeIndicator, 
                price_change_24h < 0 ? 
                    { backgroundColor: currentTheme.indicators?.negativeBg || theme.colors.indicators.negativeBg } : 
                    { backgroundColor: currentTheme.indicators?.positiveBg || theme.colors.indicators.positiveBg },
                { transform: [{ scale: changeScaleAnim }] }
                ]}
            >
                <Animated.Text 
                style={[
                    styles.changeText, 
                    { 
                    color: changeFlashAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                        price_change_24h < 0 ? 
                            (currentTheme.indicators?.negative || theme.colors.indicators.negative) : 
                            (currentTheme.indicators?.positive || theme.colors.indicators.positive),
                        price_change_24h < 0 ? '#ff6b6b' : '#51cf66' // Brighter colors for flash
                        ]
                    })
                    }
                ]}
                >
                {price_change_24h >= 0 ? '+' : ''}{price_change_24h.toFixed(2)}%
                </Animated.Text>
            </Animated.View>
            </View>
        </View>
        </TouchableOpacity>
    </Swipeable>
  );
};

export default CryptocurrencyListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.subtle,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.lg,
    minHeight: theme.components.listItem.height,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    height: '100%',
  },
  rankText: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
    minWidth: 32,
    textAlign: 'center',
    marginRight: theme.spacing.md,
    lineHeight: theme.typography.sizes.body * 1.2,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  coinImage: {
    height: 32,
    width: 32,
    marginRight: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  coinInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  coinName: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    flexShrink: 1,
    lineHeight: theme.typography.sizes.small * 1.2,
  },
  coinSymbol: {
    fontSize: theme.typography.sizes.caption - 1,
    color: theme.colors.text.secondary,
    fontFamily: theme.typography.fontFamily,
    marginTop: 2,
    lineHeight: (theme.typography.sizes.caption - 1) * 1.2,
  },
  chartSection: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.sm,
  },
  rightSection: {
    flexDirection: "column",
    alignItems: "flex-end",
    minWidth: 100,
  },
  priceText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'right',
  },
  changeIndicator: {
    marginTop: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  changeText: {
    fontSize: theme.typography.sizes.small,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
  },
  swipeableContainer: {
    marginVertical: theme.spacing.xs,
    marginHorizontal: theme.spacing.lg,
  },
  // Swipe Action Styles
  rightActionsContainer: {
      flexDirection: 'row',
      width: 160, // Expanded width for long swipe visual
  },
  rightAction: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      borderTopRightRadius: theme.borderRadius.lg,
      borderBottomRightRadius: theme.borderRadius.lg,
  },
  leftActionsContainer: {
      flexDirection: 'row',
      width: 100,
  },
  leftAction: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderTopLeftRadius: theme.borderRadius.lg,
      borderBottomLeftRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.indicators.negative,
  },
  actionIconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
  },
  actionText: {
    color: '#ffffff',
    fontSize: theme.typography.sizes.small,
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.weights.medium,
    marginTop: 2,
  },
});