import {View, Text, Pressable, StyleSheet} from 'react-native';
import React, {useState} from 'react';

/**
 * Simple dropdown for juniors — no extra libraries.
 *
 * options: [{ label: string, value: string }]
 * value: currently selected value
 * onChange: (value) => void
 * placeholder: optional
 */
const Dropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
}) => {
  const [open, setOpen] = useState(false);

  const selected = options.find(option => option.value === value);

  const onSelect = nextValue => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={() => setOpen(prev => !prev)}
        style={[styles.trigger, open && styles.triggerOpen]}>
        <Text
          style={[styles.triggerText, !selected && styles.placeholder]}
          numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Text style={styles.chevron}>{open ? '▲' : '▼'}</Text>
      </Pressable>

      {open ? (
        <View style={styles.menu}>
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onSelect(option.value)}
                style={[styles.option, isSelected && styles.optionSelected]}>
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
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  triggerOpen: {
    borderColor: '#111827',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  triggerText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  placeholder: {
    color: '#9CA3AF',
    fontWeight: '500',
  },
  chevron: {
    fontSize: 12,
    color: '#6B7280',
  },
  menu: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#111827',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
  optionSelected: {
    backgroundColor: '#F3F4F6',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  optionTextSelected: {
    fontWeight: '700',
    color: '#111827',
  },
});

export default Dropdown;
