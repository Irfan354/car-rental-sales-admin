import api from "./api";

// Send reset link
export const forgotPassword = (email) =>
  api.post("/auth/forgot-password", { email });

// Verify reset token validity
export const verifyResetToken = (token) =>
  api.get(`/auth/verify-reset-token/${token}`);

// Reset password
export const resetPassword = (token, newPassword) =>
  api.post("/auth/reset-password", { token, newPassword });
