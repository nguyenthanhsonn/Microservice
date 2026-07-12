export const AUTH_PATTERNS = {
  REGISTER: 'auth.register',
  LOGIN: 'auth.login',
  VERIFY_OTP: 'auth.verify_otp',
  REFRESH_TOKEN: 'auth.refresh_token',
  LOGOUT: 'auth.logout',
  VALIDATE_TOKEN: 'auth.validate_token',
} as const;

export const AuthPatterns = {
  register: AUTH_PATTERNS.REGISTER,
  login: AUTH_PATTERNS.LOGIN,
  verifyOtp: AUTH_PATTERNS.VERIFY_OTP,
  refreshToken: AUTH_PATTERNS.REFRESH_TOKEN,
  logout: AUTH_PATTERNS.LOGOUT,
  validateToken: AUTH_PATTERNS.VALIDATE_TOKEN,
} as const;
