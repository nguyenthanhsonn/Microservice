export const BOOKING_PATTERNS = {
  CREATE: 'booking.create',
  FIND_MY_BOOKINGS: 'booking.find_my_bookings',
  FIND_BY_ID_FOR_USER: 'booking.find_by_id_for_user',
  FIND_BY_CODE: 'booking.find_by_code',
  CANCEL: 'booking.cancel',
  MARK_PAID: 'booking.mark_paid',
} as const;

export const BookingPatterns = {
  create: BOOKING_PATTERNS.CREATE,
  findMyBookings: BOOKING_PATTERNS.FIND_MY_BOOKINGS,
  findByIdForUser: BOOKING_PATTERNS.FIND_BY_ID_FOR_USER,
  findByCode: BOOKING_PATTERNS.FIND_BY_CODE,
  cancel: BOOKING_PATTERNS.CANCEL,
  markPaid: BOOKING_PATTERNS.MARK_PAID,
  findById: BOOKING_PATTERNS.FIND_BY_ID_FOR_USER,
} as const;
