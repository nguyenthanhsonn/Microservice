import { AuthPatterns } from './auth.patterns';
import { BookingPatterns } from './booking.patterns';
import { CINEMA_SHOWTIME_PATTERNS } from './cinema-showtime.patterns';
import { MOVIE_PATTERNS } from './movie.patterns';
import { NotificationPatterns } from './notification.patterns';
import { PAYMENT_PATTERNS } from './payment.patterns';
import { PRODUCT_PATTERNS } from './product.patterns';
import { TICKET_PATTERNS } from './ticket.patterns';
import { UserPatterns } from './user.patterns';

export const ServicePatterns = {
  health: 'health.check',
  auth: AuthPatterns,
  user: UserPatterns,
  movie: {
    list: MOVIE_PATTERNS.FIND_ALL,
    findById: MOVIE_PATTERNS.FIND_DETAIL,
    ...MOVIE_PATTERNS,
  },
  cinema: { list: 'cinema.list', ...CINEMA_SHOWTIME_PATTERNS },
  showtime: { list: 'showtime.list', ...CINEMA_SHOWTIME_PATTERNS },
  cinemaShowtime: CINEMA_SHOWTIME_PATTERNS,
  booking: BookingPatterns,
  payment: PAYMENT_PATTERNS,
  ticket: TICKET_PATTERNS,
  notification: NotificationPatterns,
  product: {
    list: PRODUCT_PATTERNS.FIND_ALL,
    ...PRODUCT_PATTERNS,
  },
} as const;
