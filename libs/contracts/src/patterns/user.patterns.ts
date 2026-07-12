export const USER_PATTERNS = {
  GET_PROFILE: 'user.get_profile',
  UPDATE_PROFILE: 'user.update_profile',
  GET_CUSTOMERS: 'user.get_customers',
  GET_STAFFS: 'user.get_staffs',
  CREATE_STAFF: 'user.create_staff',
  UPDATE_STATUS: 'user.update_status',
  RESET_STAFF_PASSWORD: 'user.reset_staff_password',
} as const;

export const UserPatterns = {
  getProfile: USER_PATTERNS.GET_PROFILE,
  updateProfile: USER_PATTERNS.UPDATE_PROFILE,
  getCustomers: USER_PATTERNS.GET_CUSTOMERS,
  getStaffs: USER_PATTERNS.GET_STAFFS,
  createStaff: USER_PATTERNS.CREATE_STAFF,
  updateStatus: USER_PATTERNS.UPDATE_STATUS,
  resetStaffPassword: USER_PATTERNS.RESET_STAFF_PASSWORD,
  findById: USER_PATTERNS.GET_PROFILE,
} as const;
