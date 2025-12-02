
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // THIS IS CRITICAL — sends session cookie
});

export default api;
