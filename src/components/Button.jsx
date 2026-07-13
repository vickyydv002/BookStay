import {Pressable, Text, StyleSheet} from 'react-native';
import React from 'react';

/**
 * Common Button component
 *
 * type:
 *  - "primary"   → dark filled button
 *  - "secondary" → outlined button
 *
 * Example:
 *  <Button title="Book Now" type="primary" onPress={() => {}} />
 *  <Button title="Cancel" type="secondary" onPress={() => {}} />
 */
const Button = ({title, type = 'primary', onPress, disabled = false}) => {
  const isPrimary = type === 'primary';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
      ]}>
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
          disabled && styles.disabledText,
        ]}>
        {title}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  // filled dark button
  primary: {
    backgroundColor: '#111827',
  },
  // white button with border
  secondary: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#111827',
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#111827',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#9CA3AF',
  },
});

export default Button;
