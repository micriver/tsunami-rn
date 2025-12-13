import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme/theme';
import { useTheme } from '../context/ThemeContext';

const FILTER_CATEGORIES = [
  'Bitcoin',
  'Ethereum',
  'DeFi',
  'NFT',
  'Regulation',
  'Markets',
];

const NewsFilterModal = ({
  visible,
  onClose,
  selectedFilters = [],
  onApply,
}) => {
  const { isDarkMode } = useTheme();
  const currentTheme = isDarkMode ? theme.colors.dark : theme.colors;
  
  // Local state to track selections before applying
  const [localSelections, setLocalSelections] = useState(selectedFilters);

  // Sync local state when modal opens or selectedFilters changes
  useEffect(() => {
    if (visible) {
      setLocalSelections(selectedFilters);
    }
  }, [visible, selectedFilters]);

  const toggleFilter = (category) => {
    setLocalSelections((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleClearAll = () => {
    // Clear filters, apply immediately, and close modal
    onApply([]);
    onClose();
  };

  const handleApply = () => {
    onApply(localSelections);
    onClose();
  };

  const isSelected = (category) => localSelections.includes(category);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: currentTheme.background.primary },
              ]}
            >
              {/* Drag Handle */}
              <View style={styles.dragHandleContainer}>
                <View
                  style={[
                    styles.dragHandle,
                    { backgroundColor: currentTheme.text.muted },
                  ]}
                />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <Text style={[styles.title, { color: currentTheme.text.primary }]}>
                  Filter News
                </Text>
                <TouchableOpacity onPress={handleClearAll}>
                  <Text
                    style={[
                      styles.clearAllText,
                      {
                        color:
                          localSelections.length > 0
                            ? theme.colors.accent.orange
                            : currentTheme.text.muted,
                      },
                    ]}
                  >
                    Clear All
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Categories Section */}
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, { color: currentTheme.text.secondary }]}
                >
                  Categories
                </Text>
                <View style={styles.chipsContainer}>
                  {FILTER_CATEGORIES.map((category) => (
                    <Pressable
                      key={category}
                      style={[
                        styles.chip,
                        isSelected(category)
                          ? styles.chipSelected
                          : {
                              borderColor: currentTheme.text.muted,
                              backgroundColor: 'transparent',
                            },
                      ]}
                      onPress={() => toggleFilter(category)}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected(category)
                            ? styles.chipTextSelected
                            : { color: currentTheme.text.secondary },
                        ]}
                      >
                        {category}
                      </Text>
                      {isSelected(category) && (
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color="#ffffff"
                          style={styles.chipIcon}
                        />
                      )}
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
              >
                <Text style={styles.applyButtonText}>
                  {localSelections.length > 0
                    ? `Apply Filters (${localSelections.length})`
                    : 'Show All News'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: theme.borderRadius.xl,
    borderTopRightRadius: theme.borderRadius.xl,
    paddingBottom: theme.spacing.xxxl,
    ...theme.shadows.strong,
  },
  dragHandleContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.h3,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily,
  },
  clearAllText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  section: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.caption,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.md,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1.5,
    marginBottom: theme.spacing.xs,
  },
  chipSelected: {
    backgroundColor: theme.colors.accent.orange,
    borderColor: theme.colors.accent.orange,
  },
  chipText: {
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.medium,
    fontFamily: theme.typography.fontFamily,
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  chipIcon: {
    marginLeft: theme.spacing.xs,
  },
  applyButton: {
    backgroundColor: theme.colors.accent.orange,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    marginHorizontal: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.subtle,
  },
  applyButtonText: {
    color: '#ffffff',
    fontSize: theme.typography.sizes.body,
    fontWeight: theme.typography.weights.semibold,
    fontFamily: theme.typography.fontFamily,
  },
});

export default NewsFilterModal;
