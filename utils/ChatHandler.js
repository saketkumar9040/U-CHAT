import { child, getDatabase, push, ref, update } from "firebase/database";
import { app } from "../firebase/FirebaseConfig";

const dbRef = ref(getDatabase(app));

export const SaveNewChat = async (loggedInUserId, chatData) => {
  const newChatData = {
    users: [...chatData],
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const newChat = await push(child(dbRef, "Chats"), newChatData);

  let chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef, `UsersChats/${userId}`), newChat.key);
  }
  // console.log(newChat.key)
  return newChat.key;
};

export const saveMessage = async (chatId, senderId, messageText) => {
  const messageRef = child(dbRef, `Messages/${chatId}`);
  const messageData = {
    sentBy: senderId,
    sentAt: new Date().toISOString(),
    text: messageText,
  };
  await push(messageRef, messageData);

  const chatRef = child(dbRef, `Chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderId,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  });
};
