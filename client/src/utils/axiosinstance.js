import axios from "axios";
import { BASE_URL } from "./constants";

// Create an axios instance with default configurations
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",  // Ensure proper Content-Type header for JSON data
  },
});

// Request interceptor to add Authorization token to headers if it exists
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;  // Add Authorization header
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);  // Handle error if the request fails
  }
);

// Optionally, you can add a response interceptor to handle certain response scenarios globally
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       // Handle unauthorized error (e.g., redirect to login)
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
