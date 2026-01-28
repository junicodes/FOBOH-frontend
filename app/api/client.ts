// Axios client for all HTTP requests, kept separate from UI components.
import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4001",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
