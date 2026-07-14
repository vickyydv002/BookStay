// Small date helpers used by booking screens

export const formatDate = date => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDate = dateString => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const addDays = (dateString, days) => {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const getTodayString = () => formatDate(new Date());

export const getNightCount = (checkIn, checkOut) => {
  const start = parseDate(checkIn);
  const end = parseDate(checkOut);
  const diff = (end - start) / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round(diff));
};

// Lowest available rooms across the stay (using hotel roomsBookedByDate)
export const getAvailableForRange = (hotel, checkIn, checkOut) => {
  if (!hotel?.totalRooms) {
    return 0;
  }

  let current = checkIn;
  let lowest = hotel.totalRooms;

  while (current < checkOut) {
    const dayEntry = hotel.roomsBookedByDate?.find(item => item.date === current);
    const booked = dayEntry ? dayEntry.roomsBooked : 0;
    const available = hotel.totalRooms - booked;
    if (available < lowest) {
      lowest = available;
    }
    current = addDays(current, 1);
  }

  return Math.max(0, lowest);
};
