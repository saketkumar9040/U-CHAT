import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        storedMessages:{}
    },
    reducers:{
        setStoredMessage:(state,action) => {
            // console.log(action.payload)
            const existingMessages = state.storedMessages
            const { chatId, messageData } =action.payload
            existingMessages[chatId] = messageData
            
            state.storedMessages = existingMessages
            // console.log(state.storedMessages)
        }
    }
});

export const messageReducer = messageSlice.reducer;
export const setStoredMessage = messageSlice.actions.setStoredMessage;