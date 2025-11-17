import axios from "axios";
import jwtDecode from "jwt-decode";
import store from "../store/store";
import { logout, setCredentials } from "../store/authSlice";
import { refreshToken as mockRefreshToken } from "../utils/mockApi";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // replace with real backend API
});

api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;
    if (!originalRequest) return Promise.reject(err);

    const status = err.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const storedRefresh = localStorage.getItem("refreshToken");
      if (!storedRefresh) {
        store.dispatch(logout());
        return Promise.reject(err);
      }

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      isRefreshing = true;

      try {
        const refreshRes = await mockRefreshToken(storedRefresh);
        const { accessToken, refreshToken } = refreshRes;

        store.dispatch(setCredentials({ accessToken, refreshToken }));
        localStorage.setItem("refreshToken", refreshToken);

        processQueue(null, accessToken);

        originalRequest.headers.Authorization = "Bearer " + accessToken;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
