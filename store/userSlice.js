import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    storedUser: {},
  },
  reducers: {
    setStoredUsers: (state, action) => {
      const newUsers = action.payload.newUsers;
      // console.log(newUsers)
      const existingUsers = state.storedUser;
      // console.log(existingUsers)
      const usersArray = Object.values(newUsers);

      for(let i =0 ;i <usersArray.length;i++){
        const userData= usersArray[i];
        existingUsers[userData.uid] = userData;
      }
      state.storedUser = existingUsers;
      // console.log(state.storedUser)
    },
  },
});
export const userReducer = userSlice.reducer;
export const setStoredUsers = userSlice.actions.setStoredUsers;
