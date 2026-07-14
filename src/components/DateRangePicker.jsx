import {View, Text, Pressable, StyleSheet, Platform} from 'react-native';
import React, {useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  addDays,
  formatDate,
  getTodayString,
  parseDate,
} from '../utils/bookingDates';

/**
 * Stay date picker using @react-native-community/datetimepicker
 * Tap a date field to open the calendar.
 */
const DateRangePicker = ({checkIn, checkOut, onChange}) => {
  const today = getTodayString();
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);

  const onCheckInChange = (event, selectedDate) => {
    // Android closes the dialog after pick / cancel
    if (Platform.OS === 'android') {
      setShowCheckInPicker(false);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    const nextCheckIn = formatDate(selectedDate);
    if (nextCheckIn < today) {
      return;
    }

    let nextCheckOut = checkOut;
    if (nextCheckIn >= checkOut) {
      nextCheckOut = addDays(nextCheckIn, 1);
    }

    onChange({checkIn: nextCheckIn, checkOut: nextCheckOut});
  };

  const onCheckOutChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowCheckOutPicker(false);
    }

    if (event.type === 'dismissed' || !selectedDate) {
      return;
    }

    const nextCheckOut = formatDate(selectedDate);
    if (nextCheckOut <= checkIn) {
      return;
    }

    onChange({checkIn, checkOut: nextCheckOut});
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.field}>
        <Text style={styles.label}>Check-in date</Text>
        <Pressable
          onPress={() => {
            setShowCheckOutPicker(false);
            setShowCheckInPicker(true);
          }}
          style={styles.dateButton}>
          <Text style={styles.date}>{checkIn}</Text>
          <Text style={styles.hint}>Tap to pick</Text>
        </Pressable>

        {showCheckInPicker ? (
          <>
            {Platform.OS === 'ios' ? (
              <Pressable
                onPress={() => setShowCheckInPicker(false)}
                style={styles.doneBtn}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            ) : null}
            <DateTimePicker
              value={parseDate(checkIn)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={parseDate(today)}
              onChange={onCheckInChange}
            />
          </>
        ) : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Check-out date</Text>
        <Pressable
          onPress={() => {
            setShowCheckInPicker(false);
            setShowCheckOutPicker(true);
          }}
          style={styles.dateButton}>
          <Text style={styles.date}>{checkOut}</Text>
          <Text style={styles.hint}>Tap to pick</Text>
        </Pressable>

        {showCheckOutPicker ? (
          <>
            {Platform.OS === 'ios' ? (
              <Pressable
                onPress={() => setShowCheckOutPicker(false)}
                style={styles.doneBtn}>
                <Text style={styles.doneText}>Done</Text>
              </Pressable>
            ) : null}
            <DateTimePicker
              value={parseDate(checkOut)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              minimumDate={parseDate(addDays(checkIn, 1))}
              onChange={onCheckOutChange}
            />
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  hint: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  doneBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  doneText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
});

export default DateRangePicker;
