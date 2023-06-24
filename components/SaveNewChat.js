import { child, getDatabase, push, ref } from "firebase/database"
import { app } from "../firebase/FirebaseConfig";


export const SaveNewChat = async(loggedInUserId,chatData) => {
   const newChatData = {
    users:[...chatData],
    createdBy:loggedInUserId,
    updatedBy:loggedInUserId,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString(),
   }
   const dbRef = ref(getDatabase(app));
   const newChat = await push(child(dbRef,"Chats"),newChatData);

   let chatUsers = newChatData.users;
   for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef,`UsersChats/${userId}`),newChat.key);
   }
   // console.log(newChat.key)
   return newChat.key
}

