// src/app/lib/api.js
import axios from "axios";
import { getToken, removeToken } from "./tokenService";

// Base API configuration
const api = axios.create({
  baseURL: "http://localhost:8081/api", // Spring Boot backend
  withCredentials: false,               // no cookies needed since we're using JWT
});

// Request interceptor — inject jwt token into Authorization header
api.interceptors.request.use((config) => {
  const token = getToken();     // get token from sessionStorage 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, 
  (error) => {
    return Promise.reject(error);
  });

// Response interceptor - handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized! Token might have expired.");
        removeToken();
      window.location.href = "/auth/login";             // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
