import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chats",
    initialState:{
        chatsData:{}
    },
    reducers: {
        setChatData: (state, action) => {
            state.chatsData = action.payload.chatsData
            // console.log(state.chatsData)
        },
        updateChatData:(state,action) => {
            // console.log(action.payload.chatsData)
            state.chatsData = {...state.chatsData,...action.payload.chatsData}
            // console.log(state.chatsData)
        }
      },
});

export const chatReducer = chatSlice.reducer;
export const setChatData = chatSlice.actions.setChatData
export const updateChatData = chatSlice.actions.updateChatData