import { child, get, getDatabase, push, ref, remove, set, update } from "firebase/database";
import { app } from "../firebase/FirebaseConfig";
import { Alert } from "react-native";
import { getUserPushTokens } from "./tokenHandler";

const dbRef = ref(getDatabase(app));

export const SaveNewChat = async (loggedInUserId, chatData,groupName=null,groupProfilePic=null,imageName=null) => {
  const newChatData = {
    users: [...chatData],
    createdBy: loggedInUserId,
    updatedBy: loggedInUserId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), 
  };

  if(groupName){
    newChatData.groupName=groupName;
  }
  if(groupProfilePic){
    newChatData.groupProfilePic=groupProfilePic;
  }
  if(imageName){
    newChatData.imageName=imageName;
  }

  const newChat = await push(child(dbRef, "Chats"), newChatData);
  // console.log(newChat.key)

  let chatUsers = newChatData.users;
  for (let i = 0; i < chatUsers.length; i++) {
    const userId = chatUsers[i];
    await push(child(dbRef, `UsersChats/${userId}`), newChat.key);
  }
  return newChat.key;
};

export const sendMessage = async (chatId, senderData, messageText,replyTo=null,imageURL=null,type=null,chatUsers=null) => {
    // console.log("save message chat id"+chatId);
    // console.log(senderId)
    // console.log(messageText)
  const messageRef = child(dbRef, `Messages/${chatId}`);
  const messageData = {
    sentBy: senderData.uid,
    sentAt: new Date().toISOString(),
    text: messageText,
  };
  if(replyTo){
    messageData.replyTo=replyTo;
  }
  if(imageURL){
    messageData.imageURL=imageURL
  }
  if(type){
    messageData.type=type;
  }
  
  await push(messageRef, messageData);

  const chatRef = child(dbRef, `Chats/${chatId}`);
  await update(chatRef, {
    updatedBy: senderData.uid,
    updatedAt: new Date().toISOString(),
    latestMessageText: messageText,
  });

  // SENDING PUSH NOTIFICATION TO USERS ===================================>
  if(messageText=="Image"){
    messageText="sent an Image🖼"
  }
  if(chatUsers){
    let otherUsers = chatUsers.filter(e=>e!==senderData.uid)
    return await sendPushNotifications(otherUsers,senderData.name,messageText,chatId)
  }
};

export const starMessage = async (userId,chatId,messageId) => {
   try {
      const  starMessageRef = child(dbRef,`StarredMessages/${userId}/${chatId}/${messageId}`);
      const snapshot = await get(starMessageRef);
      if(snapshot.exists()){
        // UN-STAR MESSAGE
        await remove(starMessageRef)
        return Alert.alert(`Un-Starred😵`);
      }else{
        //  STAR MESSAGE
        const starredMessageData = {
            messageId,
            chatId,
            starredAt : new Date().toISOString(),
        };
        await set(starMessageRef,starredMessageData);
        return Alert.alert(`Starred🤩`);
       
      }
   } catch (error) {
      console.log(error)
   }
};

export const getOtherUserChats = async(userId) => {
  try {
    const chatRef =await child(dbRef,`UsersChats/${userId}`);
    const snapshot =await get(chatRef);
    return snapshot.val();
  } catch (error) {
     console.log(error)
  }
}

export const removeFromChat = async(userLoggedInUid,removeUserUid,chatData) => {
  try {
    const newChatUsers = chatData.users.filter((u)=>u!==removeUserUid);
    // console.log(removeUserUid)
    const updatedChatData = {
      ...chatData,
      users:newChatUsers,
      updatedAt:new Date().toISOString(),
      updatedBy:userLoggedInUid,
    }
    const chatRef = child(dbRef,`Chats/${chatData.key}`);
    await update(chatRef,updatedChatData);
    const userChatRef = child(dbRef,`UsersChats/${removeUserUid}`);
    const snapshot =await get(userChatRef)
    const userChats = snapshot.val();  
    // console.log(userChats)
    
    for(const key in userChats){
       const currentChatId = userChats[key];
       if(currentChatId===chatData.key){
         const deleteChatRef = child(dbRef,`UsersChats/${removeUserUid}/${key}`)
         await remove(deleteChatRef);
         break;
       }
    }
  } catch (error) {
    console.log(error)
  }
}

export const sendPushNotifications = async(chatUsers,title,body,chatId) => {
  try {
    chatUsers.forEach(async(uid) => {
     const tokens = await getUserPushTokens(uid);
     for(const key in tokens){
      const token = tokens[key];
       await fetch('https://exp.host/--/api/v2/push/send',{
         method:"POST",
         headers:{
          "Content-Type":"application/json"
         },
         body:JSON.stringify({
          to:token,
          sound: 'default',
          title,
          body,
          data:{chatId}
         })
       })
     }
    });
    
  } catch (error) {
      console.log(error)
  }
}

export const deleteMessage = async(userId,chatId,messageData) => {
  try {
    // console.log(userId)
    // console.log(chatId)
    // console.log(messageData);
    const messageRef = child(dbRef,`Messages/${chatId}/${messageData.key}`);
    const updatedMessageData = {
      ...messageData,
      deletedAt: new Date().toISOString(),
      text:"This Message was Deleted"
    }
    if(messageData.imageURL){
        delete updatedMessageData.imageURL
    }
    await update(messageRef,updatedMessageData);

  } catch (error) {
    console.log(error)
  }
}