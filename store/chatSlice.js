import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chats",
    initialState:{
        chatsData:{}
    },
    reducers: {
        setChatData: (state, action) => {
            state.chatsData = action.payload.chatsData
        },
      },
});

export const chatReducer = chatSlice.reducer;
export const setChatData = chatSlice.actions.setChatData