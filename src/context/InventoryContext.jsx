import React, {createContext, useContext, useMemo, useState} from 'react';
import {
  TOTAL_ROOMS,
  ROOM_TIERS,
  getTodayString,
  getStayNightDates,
  createBookingRef,
  addDays,
} from '../constants/inventory';

const InventoryContext = createContext(null);

// Demo seed: some rooms already booked around "today"
// so available count is not always 50
const buildSeedBookings = () => {
  const today = getTodayString();
  const bookings = [];

  // Book 38 rooms for tonight → 12 left today
  for (let i = 1; i <= 38; i++) {
    bookings.push({
      id: `seed-${i}`,
      roomId: `ROOM-${String(i).padStart(2, '0')}`,
      tierId: 'standard',
      checkIn: today,
      checkOut: addDays(today, 1),
      guests: 1,
      reference: `#SIEMS-SEED${i}`,
    });
  }

  return bookings;
};

export const InventoryProvider = ({children}) => {
  const [bookings, setBookings] = useState(buildSeedBookings);

  // How many rooms are taken on a single night
  const getBookedCountForDate = dateString => {
    return bookings.filter(
      booking => booking.checkIn <= dateString && dateString < booking.checkOut,
    ).length;
  };

  // Available rooms for one date
  const getAvailableForDate = dateString => {
    return TOTAL_ROOMS - getBookedCountForDate(dateString);
  };

  // Lowest available count across the whole stay
  const getAvailableForRange = (checkIn, checkOut) => {
    const nights = getStayNightDates(checkIn, checkOut);
    if (nights.length === 0) {
      return 0;
    }

    let lowest = TOTAL_ROOMS;
    nights.forEach(night => {
      const available = getAvailableForDate(night);
      if (available < lowest) {
        lowest = available;
      }
    });
    return lowest;
  };

  // Find a free room id for this stay
  const findFreeRoomId = (checkIn, checkOut) => {
    for (let i = 1; i <= TOTAL_ROOMS; i++) {
      const roomId = `ROOM-${String(i).padStart(2, '0')}`;
      const isTaken = bookings.some(
        booking =>
          booking.roomId === roomId &&
          booking.checkIn < checkOut &&
          checkIn < booking.checkOut,
      );
      if (!isTaken) {
        return roomId;
      }
    }
    return null;
  };

  // Lock one room for the booking (demo "server-side lock")
  const bookRoom = ({checkIn, checkOut, guests, tierId}) => {
    const available = getAvailableForRange(checkIn, checkOut);
    if (available <= 0) {
      return {ok: false, message: 'No balance rooms available for these dates.'};
    }

    const roomId = findFreeRoomId(checkIn, checkOut);
    if (!roomId) {
      return {ok: false, message: 'No balance rooms available for these dates.'};
    }

    const reference = createBookingRef();
    const newBooking = {
      id: `${Date.now()}`,
      roomId,
      tierId,
      checkIn,
      checkOut,
      guests,
      reference,
    };

    setBookings(prev => [...prev, newBooking]);
    return {ok: true, booking: newBooking};
  };

  const value = useMemo(
    () => ({
      totalRooms: TOTAL_ROOMS,
      roomTiers: ROOM_TIERS,
      bookings,
      availableToday: getAvailableForDate(getTodayString()),
      getAvailableForRange,
      bookRoom,
    }),
    [bookings],
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used inside InventoryProvider');
  }
  return context;
};
