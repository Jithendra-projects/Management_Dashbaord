import { createSlice } from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: localStorage.getItem("refreshToken") || null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken || state.refreshToken;
      try {
        const decoded = jwtDecode(accessToken);
        state.user = decoded;
      } catch {
        state.user = null;
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    },

    refreshTokens: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
        localStorage.setItem("refreshToken", refreshToken);
      }
      try {
        state.user = jwtDecode(accessToken);
      } catch {
        state.user = null;
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, refreshTokens, logout } = slice.actions;
export default slice.reducer;
