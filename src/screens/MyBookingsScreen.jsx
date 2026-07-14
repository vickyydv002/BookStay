import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useBookingStore} from '../store/bookingStore';
import {formatPrice} from '../utils/formatPrice';

export function MyBookingsScreen() {
  const navigation = useNavigation();
  const bookings = useBookingStore(state => state.bookings);

  const openDetails = bookingId => {
    navigation.navigate('BookingDetails', {bookingId});
  };

  const renderItem = ({item}) => (
    <Pressable onPress={() => openDetails(item.id)} style={styles.card}>
      <Text style={styles.hotelName}>{item.hotelName}</Text>
      <Text style={styles.ref}>Ref: {item.id}</Text>
      <Text style={styles.line}>
        {item.roomCount || 1} × {item.roomType}
      </Text>
      <Text style={styles.line}>
        {item.guestCount || 1} guest{(item.guestCount || 1) === 1 ? '' : 's'}
      </Text>
      <Text style={styles.line}>
        {item.checkIn} at {item.checkInTime} → {item.checkOut}
      </Text>
      <Text style={styles.line}>
        {item.nights} night{item.nights === 1 ? '' : 's'} ·{' '}
        {formatPrice(item.totalPrice)}
      </Text>
      <Text style={styles.tapHint}>Tap for details ›</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {bookings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>
            Book a hotel from Home, then your stays will show up here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hotelName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  ref: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 8,
  },
  line: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 2,
  },
  tapHint: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
