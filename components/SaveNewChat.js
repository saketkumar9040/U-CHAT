import { child, push, ref } from "firebase/database"
import { db } from "../firebase/FirebaseConfig"


export const SaveNewChat = async(loggedInUserId,chatData) => {
   const newChatData = {
    ...chatData,
    createdBy:loggedInUserId,
    updatedBy:loggedInUserId,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString(),
   }
   const dbRef = ref(db);
   const newChat = await push(child(dbRef,"Chats"),newChatData);

   let chatUsers = newChatData.users;
   for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef,`UsersChats/${userId}`),newChat.key);
   }
   return newChat.key
}

