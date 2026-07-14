import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import BottomSheet from './BottomSheet';

export const FILTER_OPTIONS = [
  {id: 'all', label: 'All hotels'},
  {id: 'available', label: 'Available rooms only'},
  {id: 'rating_4_5', label: 'Rating 4.5+'},
  {id: 'rating_4_8', label: 'Rating 4.8+'},
  {id: 'under_300', label: 'Under ₹300 / night'},
];

export const SORT_OPTIONS = [
  {id: 'default', label: 'Default'},
  {id: 'rating_desc', label: 'Highest rating'},
  {id: 'price_asc', label: 'Price: low to high'},
  {id: 'price_desc', label: 'Price: high to low'},
  {id: 'name_asc', label: 'Name: A–Z'},
];

const FilterAndSort = ({
  selectedFilter = 'all',
  selectedSort = 'default',
  onFilterChange,
  onSortChange,
}) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.button, selectedFilter !== 'all' && styles.buttonActive]}
        onPress={() => setFilterOpen(true)}>
        <Text
          style={[
            styles.buttonText,
            selectedFilter !== 'all' && styles.buttonTextActive,
          ]}>
          Filter
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.button,
          selectedSort !== 'default' && styles.buttonActive,
        ]}
        onPress={() => setSortOpen(true)}>
        <Text
          style={[
            styles.buttonText,
            selectedSort !== 'default' && styles.buttonTextActive,
          ]}>
          Sort
        </Text>
      </Pressable>

      <BottomSheet visible={filterOpen} onClose={() => setFilterOpen(false)}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Filter</Text>
          <Pressable
            onPress={() => {
              onFilterChange?.('all');
              setFilterOpen(false);
            }}
            disabled={selectedFilter === 'all'}
            hitSlop={8}>
            <Text
              style={[
                styles.clearText,
                selectedFilter === 'all' && styles.clearTextDisabled,
              ]}>
              Clear filter
            </Text>
          </Pressable>
        </View>
        {FILTER_OPTIONS.map(option => {
          const isSelected = selectedFilter === option.id;
          return (
            <Pressable
              key={option.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => {
                onFilterChange?.(option.id);
                setFilterOpen(false);
              }}>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </BottomSheet>

      <BottomSheet visible={sortOpen} onClose={() => setSortOpen(false)}>
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Sort</Text>
          <Pressable
            onPress={() => {
              onSortChange?.('default');
              setSortOpen(false);
            }}
            disabled={selectedSort === 'default'}
            hitSlop={8}>
            <Text
              style={[
                styles.clearText,
                selectedSort === 'default' && styles.clearTextDisabled,
              ]}>
              Clear sort
            </Text>
          </Pressable>
        </View>
        {SORT_OPTIONS.map(option => {
          const isSelected = selectedSort === option.id;
          return (
            <Pressable
              key={option.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => {
                onSortChange?.(option.id);
                setSortOpen(false);
              }}>
              <Text
                style={[
                  styles.optionText,
                  isSelected && styles.optionTextSelected,
                ]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#111827',
    backgroundColor: '#FFFFFF',
  },
  buttonActive: {
    backgroundColor: '#111827',
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  buttonTextActive: {
    color: '#FFFFFF',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  clearTextDisabled: {
    color: '#D1D5DB',
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  optionSelected: {
    backgroundColor: '#F3F4F6',
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  optionTextSelected: {
    fontWeight: '700',
    color: '#111827',
  },
});

export default FilterAndSort;
