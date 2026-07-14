import {StyleSheet, Text, View, Pressable} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useBookingStore} from '../store/bookingStore';

export function ProfileScreen() {
  const navigation = useNavigation();
  const bookings = useBookingStore(state => state.bookings);

  const openBookings = () => {
    // Profile is inside tabs; MyBookings lives on the root stack
    navigation.navigate('MyBookings');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your booking account</Text>

        <Text style={styles.sectionLabel}>Bookings</Text>
        <Pressable onPress={openBookings} style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>My Bookings</Text>
            <Text style={styles.rowMeta}>
              {bookings.length === 0
                ? 'No bookings yet'
                : `${bookings.length} booking${
                    bookings.length === 1 ? '' : 's'
                  }`}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  rowMeta: {
    fontSize: 13,
    color: '#6B7280',
  },
  chevron: {
    fontSize: 28,
    color: '#9CA3AF',
    fontWeight: '300',
    marginTop: -2,
  },
});
