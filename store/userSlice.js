import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    storedUser: {},
  },
  reducers: {
    setStoredUsers: (state, action) => {
      const newUsers = action.payload.newUsers;
      const existingUsers = state.storedUser;
      existingUsers[newUsers.uid] = newUsers;
      state.storedUser = existingUsers;
      console.log(state.storedUser)
    },
  },
});
export const userReducer = userSlice.reducer;
export const setStoredUsers = userSlice.actions.setStoredUsers;
