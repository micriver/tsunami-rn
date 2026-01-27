import React, { useState, useEffect, useRef, useCallback, createContext, useContext } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

// Toast Context for global toast management
const ToastContext = createContext(null);

// Toast types with corresponding colors
const TOAST_TYPES = {
  error: {
    backgroundColor: theme.colors.indicators.negative,
    textColor: '#ffffff',
  },
  success: {
    backgroundColor: theme.colors.indicators.positive,
    textColor: '#ffffff',
  },
  warning: {
    backgroundColor: theme.colors.accent.orange,
    textColor: '#ffffff',
  },
  info: {
    backgroundColor: theme.colors.brand.primary,
    textColor: '#ffffff',
  },
};

// Default auto-dismiss duration (3 seconds)
const DEFAULT_DURATION = 3000;

// Individual Toast component
const Toast = ({ message, type = 'error', onDismiss }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { isDarkMode } = useTheme();

  const toastStyle = TOAST_TYPES[type] || TOAST_TYPES.error;

  useEffect(() => {
    // Slide in and fade in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss after duration
    const timer = setTimeout(() => {
      dismissToast();
    }, DEFAULT_DURATION);

    return () => clearTimeout(timer);
  }, []);

  const dismissToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          backgroundColor: toastStyle.backgroundColor,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={[styles.toastText, { color: toastStyle.textColor }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
};

// Toast Provider component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);

  const showToast = useCallback((message, type = 'error') => {
    const id = toastIdRef.current++;
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const hideToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const value = {
    showToast,
    showError: (message) => showToast(message, 'error'),
    showSuccess: (message) => showToast(message, 'success'),
    showWarning: (message) => showToast(message, 'warning'),
    showInfo: (message) => showToast(message, 'info'),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View style={styles.toastWrapper} pointerEvents="box-none">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onDismiss={() => hideToast(toast.id)}
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

// Custom hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Global toast instance for use outside React components (e.g., API calls)
let globalToastRef = null;

export const setGlobalToastRef = (ref) => {
  globalToastRef = ref;
};

export const showGlobalToast = (message, type = 'error') => {
  if (globalToastRef) {
    globalToastRef.showToast(message, type);
  } else {
    console.warn('Toast not available - ToastProvider not mounted');
  }
};

export const showGlobalError = (message) => showGlobalToast(message, 'error');
export const showGlobalSuccess = (message) => showGlobalToast(message, 'success');
export const showGlobalWarning = (message) => showGlobalToast(message, 'warning');

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: 'center',
    paddingTop: 50, // Account for status bar
  },
  toastContainer: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    width: width - (theme.spacing.lg * 2),
    maxWidth: 400,
    ...theme.shadows.moderate,
  },
  toastText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'center',
  },
});

export default Toast;
