import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./Slice";

export const store = configureStore({
     reducer:{
        auth:authReducer
     }
});