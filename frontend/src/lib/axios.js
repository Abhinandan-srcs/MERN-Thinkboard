import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api"

const api = axios.create({
    baseURL: BASE_URL,
});

//  hook — attaches token to every request
export const useApiWithAuth = () => {
  const { getToken } = useAuth();

  const authApi = axios.create({ baseURL: BASE_URL });

  authApi.interceptors.request.use(async (config) => {
    const token = await getToken();  // get Clerk token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // attach to every request
    }
    return config;
  });

  return authApi;
};

export default api;

export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}