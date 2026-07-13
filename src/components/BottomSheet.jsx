import {
  Modal,
  View,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

/**
 * Reusable bottom sheet wrapper.
 * Pass any children; sheet height matches content (capped at 90% of screen).
 * Tap the dimmed area outside the sheet to close.
 */
const BottomSheet = ({visible, onClose, children}) => {
  const insets = useSafeAreaInsets();
  const {height: windowHeight} = useWindowDimensions();
  const maxHeight = windowHeight * 0.9;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.root}>
          <TouchableWithoutFeedback
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close bottom sheet">
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          <View
            style={[
              styles.sheet,
              {
                maxHeight,
                paddingBottom: Math.max(insets.bottom, 16),
              },
            ]}
            // Keep sheet presses from falling through to the backdrop
            onStartShouldSetResponder={() => true}>
            <View style={styles.handle} />

            <ScrollView
              bounces={false}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}>
              {children}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    flexGrow: 0,
  },
});

export default BottomSheet;
