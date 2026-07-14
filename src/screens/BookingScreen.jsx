import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import React, {useMemo, useState, useEffect} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getHotelDetailsById} from '../constants/hotelDetails';
import DateRangePicker from '../components/DateRangePicker';
import Dropdown from '../components/Dropdown';
import Button from '../components/Button';
import {
  addDays,
  getTodayString,
  getNightCount,
  getAvailableForRange,
} from '../utils/bookingDates';
import {useBookingStore} from '../store/bookingStore';
import {formatPrice} from '../utils/formatPrice';

const CHECK_IN_TIMES = ['14:00', '15:00', '16:00', '17:00'];

function BookingScreen() {
  const navigation = useNavigation();
  const {hotelId} = useRoute().params;
  const insets = useSafeAreaInsets();
  const addBooking = useBookingStore(state => state.addBooking);

  const hotel = getHotelDetailsById(hotelId);
  const today = getTodayString();

  const [selectedRoomType, setSelectedRoomType] = useState(
    hotel?.roomPricing?.[0]?.type || null,
  );
  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(addDays(today, 1));
  const [checkInTime, setCheckInTime] = useState(
    hotel?.checkIn || CHECK_IN_TIMES[1],
  );
  const [roomCount, setRoomCount] = useState(1);
  const [guestCount, setGuestCount] = useState(1);

  const roomOptions = useMemo(() => {
    return (hotel?.roomPricing || []).map(room => ({
      value: room.type,
      label: `${room.type} · ${formatPrice(room.pricePerNight)}/night · up to ${room.maxGuests} guests`,
    }));
  }, [hotel]);

  const selectedRoom = useMemo(() => {
    return hotel?.roomPricing?.find(room => room.type === selectedRoomType);
  }, [hotel, selectedRoomType]);

  const nights = getNightCount(checkIn, checkOut);
  const available = hotel ? getAvailableForRange(hotel, checkIn, checkOut) : 0;
  const maxRooms = Math.max(available, 1);
  const canBookRequested = available > 0 && roomCount <= available;
  const maxGuestsAllowed = selectedRoom
    ? selectedRoom.maxGuests * roomCount
    : 1;
  const totalPrice = selectedRoom
    ? selectedRoom.pricePerNight * nights * roomCount
    : 0;

  // Keep room count inside the available range when dates change
  useEffect(() => {
    if (available > 0 && roomCount > available) {
      setRoomCount(available);
    }
    if (available === 0) {
      setRoomCount(1);
    }
  }, [available, roomCount]);

  // If rooms/type change and guests no longer fit, warn and reduce
  useEffect(() => {
    if (selectedRoom && guestCount > maxGuestsAllowed) {
      Alert.alert(
        'Too many guests',
        `Each ${selectedRoom.type} fits up to ${selectedRoom.maxGuests} guest(s). With ${roomCount} room(s) you can bring ${maxGuestsAllowed} guest(s) max.`,
      );
      setGuestCount(maxGuestsAllowed);
    }
  }, [maxGuestsAllowed, guestCount, selectedRoom, roomCount]);

  const increaseGuests = () => {
    if (!selectedRoom) {
      Alert.alert('Select a room', 'Please pick a room type first.');
      return;
    }
    if (guestCount >= maxGuestsAllowed) {
      Alert.alert(
        'Guest limit exceeded',
        `This room type allows up to ${selectedRoom.maxGuests} guest(s) per room.\n\nWith ${roomCount} room(s), max guests = ${maxGuestsAllowed}.\nAdd more rooms or choose a larger room type.`,
      );
      return;
    }
    setGuestCount(guestCount + 1);
  };

  if (!hotel) {
    return (
      <View style={styles.center}>
        <Text>Hotel not found.</Text>
      </View>
    );
  }

  const onDateChange = ({checkIn: nextIn, checkOut: nextOut}) => {
    setCheckIn(nextIn);
    setCheckOut(nextOut);
  };

  const onConfirm = () => {
    if (!selectedRoom) {
      Alert.alert('Select a room', 'Please pick a room type first.');
      return;
    }
    if (available <= 0) {
      Alert.alert(
        'Not available',
        'No balance rooms available for these dates.',
      );
      return;
    }
    if (roomCount > available) {
      Alert.alert(
        'Not enough rooms',
        `Only ${available} room(s) available for these dates.`,
      );
      return;
    }
    if (guestCount > maxGuestsAllowed) {
      Alert.alert(
        'Guest limit exceeded',
        `This room type allows up to ${selectedRoom.maxGuests} guest(s) per room.\nWith ${roomCount} room(s), max guests = ${maxGuestsAllowed}.`,
      );
      return;
    }

    const saved = addBooking({
      hotelId,
      hotelName: hotel.name,
      roomType: selectedRoom.type,
      roomCount,
      guestCount,
      maxGuestsPerRoom: selectedRoom.maxGuests,
      pricePerNight: selectedRoom.pricePerNight,
      checkIn,
      checkOut,
      checkInTime,
      nights,
      totalPrice,
    });

    Alert.alert(
      'Booking confirmed',
      `${saved.roomCount} × ${saved.roomType}\n${saved.guestCount} guest(s)\n${saved.checkIn} at ${saved.checkInTime} → ${saved.checkOut}\n${saved.nights} night(s) · ${formatPrice(saved.totalPrice)} total`,
      [{text: 'OK', onPress: () => navigation.goBack()}],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {paddingBottom: 100 + insets.bottom},
        ]}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <Text style={styles.sectionTitle}>Choose a room</Text>
        <Dropdown
          options={roomOptions}
          value={selectedRoomType}
          onChange={setSelectedRoomType}
          placeholder="Select a room type"
        />

        <Text style={[styles.sectionTitle, styles.spaced]}>
          Number of rooms
        </Text>
        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => setRoomCount(count => Math.max(1, count - 1))}
            disabled={roomCount <= 1}
            style={[styles.stepperBtn, roomCount <= 1 && styles.stepperDisabled]}>
            <Text style={styles.stepperBtnText}>−</Text>
          </Pressable>
          <Text style={styles.stepperValue}>{roomCount}</Text>
          <Pressable
            onPress={() =>
              setRoomCount(count => Math.min(maxRooms, count + 1))
            }
            disabled={available <= 0 || roomCount >= available}
            style={[
              styles.stepperBtn,
              (available <= 0 || roomCount >= available) &&
                styles.stepperDisabled,
            ]}>
            <Text style={styles.stepperBtnText}>+</Text>
          </Pressable>
        </View>
        <Text style={styles.stepperHint}>
          Max you can book for these dates: {available}
        </Text>

        <Text style={[styles.sectionTitle, styles.spaced]}>
          Number of guests
        </Text>
        <View style={styles.stepperRow}>
          <Pressable
            onPress={() => setGuestCount(count => Math.max(1, count - 1))}
            disabled={guestCount <= 1}
            style={[
              styles.stepperBtn,
              guestCount <= 1 && styles.stepperDisabled,
            ]}>
            <Text style={styles.stepperBtnText}>−</Text>
          </Pressable>
          <Text style={styles.stepperValue}>{guestCount}</Text>
          <Pressable onPress={increaseGuests} style={styles.stepperBtn}>
            <Text style={styles.stepperBtnText}>+</Text>
          </Pressable>
        </View>
        <Text style={styles.stepperHint}>
          {selectedRoom
            ? `Up to ${selectedRoom.maxGuests} guest(s) per room · max ${maxGuestsAllowed} with ${roomCount} room(s)`
            : 'Select a room type first'}
        </Text>

        <Text style={[styles.sectionTitle, styles.spaced]}>Stay dates</Text>
        <DateRangePicker
          checkIn={checkIn}
          checkOut={checkOut}
          onChange={onDateChange}
        />

        <Text style={[styles.sectionTitle, styles.spaced]}>Check-in time</Text>
        <View style={styles.timeRow}>
          {CHECK_IN_TIMES.map(time => {
            const isSelected = time === checkInTime;
            return (
              <Pressable
                key={time}
                onPress={() => setCheckInTime(time)}
                style={[styles.timeChip, isSelected && styles.timeChipSelected]}>
                <Text
                  style={[
                    styles.timeText,
                    isSelected && styles.timeTextSelected,
                  ]}>
                  {time}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View
          style={[
            styles.availabilityBox,
            !canBookRequested && styles.availabilityError,
          ]}>
          {available > 0 ? (
            <Text
              style={
                canBookRequested
                  ? styles.availabilityText
                  : styles.availabilityErrorText
              }>
              Available rooms for these dates: {available}
              {!canBookRequested
                ? ` (you selected ${roomCount})`
                : ''}
            </Text>
          ) : (
            <Text style={styles.availabilityErrorText}>
              No balance rooms available for these dates.
            </Text>
          )}
        </View>

        {selectedRoom && nights > 0 ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLine}>
              {formatPrice(selectedRoom.pricePerNight)}/night × {nights} night
              {nights === 1 ? '' : 's'} × {roomCount} room
              {roomCount === 1 ? '' : 's'}
            </Text>
            <Text style={styles.summaryTotal}>
              {formatPrice(totalPrice)} total
            </Text>
            <Text style={styles.checkoutHint}>
              Check-out by {hotel.checkOut} on {checkOut}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {paddingBottom: Math.max(insets.bottom, 12)},
        ]}>
        <Button
          title="Confirm Booking"
          type="primary"
          onPress={onConfirm}
          disabled={!canBookRequested || !selectedRoom}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  spaced: {
    marginTop: 20,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepperBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#111827',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDisabled: {
    backgroundColor: '#D1D5DB',
  },
  stepperBtnText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 24,
  },
  stepperValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    minWidth: 28,
    textAlign: 'center',
  },
  stepperHint: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
  },
  timeChipSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  timeTextSelected: {
    color: '#FFFFFF',
  },
  availabilityBox: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  availabilityError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  availabilityErrorText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#991B1B',
  },
  summaryBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  summaryLine: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  checkoutHint: {
    marginTop: 8,
    fontSize: 13,
    color: '#6B7280',
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

export default BookingScreen;
