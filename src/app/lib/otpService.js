import api from "./api";

// Mobile OTP
export const sendMobileOtp = (mobileNumber) => api.post("/otp/mobile/send", { mobileNumber });
export const verifyMobileOtp = (mobileNumber, otp) => api.post("/otp/mobile/verify", { mobileNumber, otp });

// Email OTP
export const sendEmailOtp = (email) => api.post("/otp/email/send", { email });
export const verifyEmailOtp = (email, otp) => api.post("/otp/email/verify", { email, otp });

// Utility functions
export const isOtpExpired = (timestamp) => {
  const now = new Date().getTime();
  const otpTime = new Date(timestamp).getTime();
  return (now - otpTime) > (5 * 60 * 1000); // 5 minutes expiry
};

export default {
  sendMobileOtp,
  verifyMobileOtp,
  sendEmailOtp,
  verifyEmailOtp
};