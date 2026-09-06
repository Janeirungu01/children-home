import axios from "axios";
import { API_BASE_URL} from "../config"

const api = axios.create({
  baseURL: API_BASE_URL
});

// Attach JWT automatically
api.interceptors.request.use(
  (config) => {
    // Check for admin token first, then regular token
    const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
