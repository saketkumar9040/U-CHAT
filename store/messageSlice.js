import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name:"message",
    initialState:{
        storedMessages:{},
        starredMessages:{}
    },
    reducers:{
        setStoredMessage:(state,action) => {
            // console.log(action.payload)
            const existingMessages = state.storedMessages
            const { chatId, messageData } =action.payload
            existingMessages[chatId] = messageData
            
            state.storedMessages = existingMessages
            // console.log(state.storedMessages)
        },
        // addStarredMessages:(state,action) => {
        //     const {starredMessagesData} = action.payload
        //     state.starredMessages[starredMessagesData.messageId]=messageData
        // },
        // removeStarredMessages:(state,action) => {
        //     const {messageId} = action.payload
        //    delete state.starredMessages[messageId]
        // },
        setStarredMessages : (state,action) => {
            const { starredMessages } = action.payload
            state.starredMessages = {...starredMessages}
        }
    }
});

export const messageReducer = messageSlice.reducer;
export const {setStoredMessage,addStarredMessages,removeStarredMessages,setStarredMessages} = messageSlice.actions;
