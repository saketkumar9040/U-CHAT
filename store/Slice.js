import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    userData: null,
    didTryAutoLogin: false,
  },
  reducers: {
    authenticate: (state, action) => {
      const { payload } = action;
      state.token = payload.token;
      state.userData = payload.userData;
    },
    autoLogin: (state, action) => {
      state.didTryAutoLogin = true;
    },
    autoLogout: (state, action) => {
      state.token = null;
      state.userData = null;
      state.didTryAutoLogin = false;
    },
    updateUserData : (state,action) => {
      state.userData={...state.userData,...action.payload.updatedUserData}
      // console.log(action.payload)
    }
  },
});
export const authReducer = authSlice.reducer;
export const authenticate = authSlice.actions.authenticate;
export const autoLogin = authSlice.actions.autoLogin;
export const autoLogout = authSlice.actions.autoLogout;
export const updateUserData = authSlice.actions.updateUserData;
