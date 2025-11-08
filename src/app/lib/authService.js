import api from "./api";
import { setToken, removeToken } from "./tokenService";


//auth, token
export const registerUser = (data) => api.post("/auth/register", data);

// Login and save token
export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const token = response.data.token;
    setToken(token);        // store in sessionStorage
    return response.data;
};

// Verify token validity (optional)
export const verifyToken = async () => {
  return await api.get("/auth/verify");
};

// Logout and clear token
export const logoutUser = () => {
    removeToken();
  window.location.href = "/login";
};


// export const loginUser = (data) => api.post("/auth/login", data);
// export const verifyToken = () => api.get("/auth/verify");

// forgot, reset password
export const forgotPassword = (email) => api.post("/auth/forgot-password", { email });
export const resetPassword = (token, newPassword) => api.post("/auth/reset-password", { token, newPassword });
export const verifyResetToken = (token) => api.get(`/auth/verify-reset-token/${token}`);
