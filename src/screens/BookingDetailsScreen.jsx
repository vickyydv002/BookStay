import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useBookingStore} from '../store/bookingStore';
import Button from '../components/Button';
import {formatPrice} from '../utils/formatPrice';

function DetailRow({label, value}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

export function BookingDetailsScreen() {
  const navigation = useNavigation();
  const {bookingId} = useRoute().params;
  const insets = useSafeAreaInsets();

  const booking = useBookingStore(state =>
    state.bookings.find(item => item.id === bookingId),
  );
  const removeBooking = useBookingStore(state => state.removeBooking);

  if (!booking) {
    return (
      <View style={styles.center}>
        <Text style={styles.missing}>Booking not found.</Text>
        <Button title="Go Back" type="secondary" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const roomCount = booking.roomCount || 1;
  const bookedOn = booking.createdAt
    ? new Date(booking.createdAt).toLocaleString()
    : '—';

  const onCancel = () => {
    Alert.alert(
      'Cancel booking?',
      'This will remove the booking from your list.',
      [
        {text: 'Keep', style: 'cancel'},
        {
          text: 'Cancel booking',
          style: 'destructive',
          onPress: () => {
            removeBooking(booking.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {paddingBottom: 100 + insets.bottom},
        ]}>
        <Text style={styles.hotelName}>{booking.hotelName}</Text>
        <Text style={styles.ref}>Booking ref: {booking.id}</Text>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Stay details</Text>
          <DetailRow label="Check-in" value={`${booking.checkIn} at ${booking.checkInTime}`} />
          <DetailRow label="Check-out" value={booking.checkOut} />
          <DetailRow
            label="Duration"
            value={`${booking.nights} night${booking.nights === 1 ? '' : 's'}`}
          />
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Room details</Text>
          <DetailRow label="Room type" value={booking.roomType} />
          <DetailRow
            label="Rooms booked"
            value={`${roomCount} room${roomCount === 1 ? '' : 's'}`}
          />
          <DetailRow
            label="Guests"
            value={`${booking.guestCount || 1} guest${
              (booking.guestCount || 1) === 1 ? '' : 's'
            }`}
          />
          <DetailRow
            label="Price per night"
            value={formatPrice(booking.pricePerNight)}
          />
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Payment summary</Text>
          <Text style={styles.mathLine}>
            {formatPrice(booking.pricePerNight)}/night × {booking.nights} night
            {booking.nights === 1 ? '' : 's'} × {roomCount} room
            {roomCount === 1 ? '' : 's'}
          </Text>
          <Text style={styles.total}>
            {formatPrice(booking.totalPrice)} total
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.sectionTitle}>Other</Text>
          <DetailRow label="Booked on" value={bookedOn} />
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <Button title="Cancel Booking" type="secondary" onPress={onCancel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: '#FFFFFF',
  },
  missing: {
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  hotelName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  ref: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 4,
    marginBottom: 16,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  mathLine: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
  },
  total: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
  },
});
