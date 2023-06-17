import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        token:null,
        userData:null,
    },
    reducers:{
       authenticate : (state,action)  =>{
          const {payload} = action;
          state.token=payload.token;
          state.userData=payload.userData;
        //   console.log(state);
       }
    }
})
const authReducer = authSlice.reducer;
const authenticate = authSlice.actions.authenticate;

export {authReducer,authenticate};