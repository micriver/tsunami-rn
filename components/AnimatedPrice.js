import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import theme from '../theme';

const AnimatedPrice = ({ 
  price, 
  previousPrice, 
  style, 
  formatPrice = true,
  ...textProps 
}) => {
  const flashAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (previousPrice && price !== previousPrice) {
      // Flash animation
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();

      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [price, previousPrice]);

  const flashColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      style?.color || theme.colors.text.primary,
      price > previousPrice 
        ? theme.colors.indicators.positive 
        : theme.colors.indicators.negative
    ],
  });

  const displayValue = formatPrice 
    ? typeof price === 'number' 
      ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : price
    : price;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Animated.Text
        style={[
          style,
          { color: flashColor }
        ]}
        {...textProps}
      >
        {displayValue}
      </Animated.Text>
    </Animated.View>
  );
};

export default AnimatedPrice;