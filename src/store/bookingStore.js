import {create} from 'zustand';

/**
 * Simple Zustand store for bookings (junior-friendly).
 *
 * Usage:
 *   const bookings = useBookingStore(state => state.bookings);
 *   const addBooking = useBookingStore(state => state.addBooking);
 */
export const useBookingStore = create((set, get) => ({
  bookings: [],

  addBooking: booking => {
    const newBooking = {
      id: `BK-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...booking,
    };

    set(state => ({
      bookings: [newBooking, ...state.bookings],
    }));

    return newBooking;
  },

  removeBooking: id => {
    set(state => ({
      bookings: state.bookings.filter(item => item.id !== id),
    }));
  },

  getBookingById: id => {
    return get().bookings.find(item => item.id === id);
  },
}));
