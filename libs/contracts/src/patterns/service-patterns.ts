import { AuthPatterns } from './auth.patterns';
import { BookingPatterns } from './booking.patterns';
import { CINEMA_SHOWTIME_PATTERNS } from './cinema-showtime.patterns';
import { MoviePatterns } from './movie.patterns';
import { NotificationPatterns } from './notification.patterns';
import { PaymentPatterns } from './payment.patterns';
import { ProductPatterns } from './product.patterns';
import { TicketPatterns } from './ticket.patterns';
import { UserPatterns } from './user.patterns';

export const ServicePatterns = {
  health: 'health.check',
  auth: AuthPatterns,
  user: UserPatterns,
  movie: MoviePatterns,
  cinema: { list: 'cinema.list', ...CINEMA_SHOWTIME_PATTERNS },
  showtime: { list: 'showtime.list', ...CINEMA_SHOWTIME_PATTERNS },
  cinemaShowtime: CINEMA_SHOWTIME_PATTERNS,
  booking: BookingPatterns,
  payment: PaymentPatterns,
  ticket: TicketPatterns,
  notification: NotificationPatterns,
  product: ProductPatterns,
} as const;
