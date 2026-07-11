export const CINEMA_SHOWTIME_PATTERNS = {
  CREATE_ROOM: 'cinema_showtime.create_room',
  GENERATE_SEATS: 'cinema_showtime.generate_seats',

  CREATE_SHOWTIME: 'cinema_showtime.create_showtime',
  GET_SHOWTIME_SEATS: 'cinema_showtime.get_showtime_seats',
  LOCK_SEATS: 'cinema_showtime.lock_seats',
  RELEASE_SEATS: 'cinema_showtime.release_seats',

  VALIDATE_LOCKED_SEATS: 'cinema_showtime.validate_locked_seats',
  MARK_SEATS_SOLD: 'cinema_showtime.mark_seats_sold',
  RELEASE_BOOKING_SEATS: 'cinema_showtime.release_booking_seats',
} as const;
