import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:"auth",
    initialState:{
        token:null,
        userData:null,
        didTryAutoLogin:false,
    },
    reducers:{
       authenticate : (state,action)  =>{
          const {payload} = action;
          state.token=payload.token;
          state.userData=payload.userData;
        //   console.log(state);
       },
       autoLogin : (state,action) => {
          state.didTryAutoLogin=true;
       }
    }
})
const authReducer = authSlice.reducer;
const authenticate = authSlice.actions.authenticate;
const autoLogin = authSlice.actions.autoLogin;

export {authReducer,authenticate,autoLogin};