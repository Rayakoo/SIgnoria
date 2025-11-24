import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://signoria.gilanghuda.my.id/api/",
  withCredentials: true, // Ensure credentials are included
});

api.interceptors.request.use((config) => {
  const accessToken = Cookies.get("access_token"); // Use access_token from cookies
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default api;
