import { createSlice } from "@reduxjs/toolkit";
import { orderByKey } from "firebase/database";

const userSlice = createSlice({
  name: "users",
  initialState: {
     storedUser:{}
  },
  reducers: {
     setStoredUsers :(state,action)=>{
        const newUsers = action.payload.newUsers;
        const existingUsers = state.storedUser;
        const userArray = Object.values(newUsers);
        for(let i =0;i <userArray;i++){
            userData= userArray[i]
            existingUsers[userData.userId]= userData;
        }
        state.storedUser=existingUsers;
     }
  },
});
export const userReducer = userSlice.reducer;
export const setStoredUsers = userSlice.actions.setStoredUsers;

