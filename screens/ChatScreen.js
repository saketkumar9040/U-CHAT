import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  TextInput,
  Linking
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import BackgroundImage from "../assets/images/chatScreenBackground.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, AntDesign } from "@expo/vector-icons";
import userProfilePic from "../assets/images/userProfile.png";
import { useSelector } from "react-redux";
import ErrorBubble from "../components/ErrorBubble";
import { sendMessage, SaveNewChat } from "../utils/ChatHandler";
import MessageBubble from "../components/MessageBubble";
import {
  launchCamera,
  launchImagePicker,
  uploadImage,
} from "../utils/ImagePickerHelper";
import AwesomeAlert from "react-native-awesome-alerts";
import { ActivityIndicator } from "react-native";
import { createSelector } from "@reduxjs/toolkit";

const ChatScreen = ({ navigation, route }) => {
  // console.log(route.params);
  // const [messageData,setMessageData] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(
    route.params.chatId ? route.params.chatId : ""
  );
  const [messageFailed, setMessageFailed] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [tempImageURI, setTempImageURI] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(tempImageURI);
  // console.log(replyingTo)
  const flatlist = useRef();

  let loggedInUserData = useSelector((state) => state.auth.userData);
  // console.log(loggedInUserData.uid)

  let storedUsers = useSelector((state) => state?.users?.storedUser);
  // console.log(storedUsers)

  let chatData = useSelector(state=>state.chats.chatsData);
  // console.log(chatData[chatId])


  let groupName;
  let groupProfilePic;
  if(chatId && chatData[chatId]){
     groupName= chatData[chatId]?.groupName;
     groupProfilePic = chatData[chatId]?.groupProfilePic;
  }else{
    groupName = route?.params?.groupName || "";
    groupProfilePic= route?.params?.groupProfilePic || "";
  }

  let allChatUsers ;
    if(chatId && chatData[chatId]){
      // console.log(chatData[chatId].users)
      const allChatUserUid = chatData[chatId]?.users
      allChatUsers = allChatUserUid.map(id=>storedUsers[id])
      // console.log(allChatUsers)
    }else{
      allChatUsers== route?.params?.chatUsers || {};
    }

  let selectedUserData =allChatUsers && allChatUsers?.find(
    (e) => e?.uid !== loggedInUserData.uid
  );
  // console.log(allChatUsers)

  const storedMessageData = state=>state.messages.storedMessages[chatId];
  // console.log(storedMessageData);
  const messageData = createSelector([storedMessageData],data => {
    let messageList = [];
      for (let key in data) {
        const message = data[key];
        messageList.push({
          key,
          ...message,
        });
      }
      return messageList;
  });
  // console.log(messageData)

  const allMessageData = useSelector(messageData);
  // console.log(allMessageData);

  // useEffect(()=>{
  //   if(storedMessageData.length==0 || !storedMessageData){
  //     return ;
  //   }  const messageList = [];
  //     for (let key in storedMessageData) {
  //       const message = storedMessageData[key];
  //       messageList.push({
  //         key,
  //         ...message,
  //       });
  //     }
  //     setMessageData(messageList);
  // },[storedMessageData]);
//  console.log(messageData)
  // const messageData = useSelector((state) => {
  //   if (!chatId) {
  //     return [];
  //   }
  //   const allMessageData = state.messages.storedMessages[chatId];

  //   if (!allMessageData) {
  //     return [];
  //   }

  //   const messageList = [];
  //   for (let key in allMessageData) {
  //     const message = allMessageData[key];
  //     messageList.push({
  //       key,
  //       ...message,
  //     });
  //   }
  //   return messageList;
  // });
  // console.log(messageData);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={25} color="#fff" />
            </TouchableOpacity>
            {
             groupName ? (
              <>
                <Image
                  source={
                    groupProfilePic !== undefined ?(
                      { uri: groupProfilePic }
                    ):(
                       userProfilePic
                    )
                  }
                  style={styles.userImage}
                  resizeMode="contain"
                />
                <Text style={styles.userName}>{route.params.groupName}</Text>
              </>
            ) : (
              <>
                <Image
                  source={
                    selectedUserData?.ProfilePicURL
                      ? { uri: selectedUserData?.ProfilePicURL }
                      : userProfilePic
                  }
                  style={styles.userImage}
                  resizeMode="contain"
                />
                <Text style={styles.userName}>{selectedUserData?.name}</Text>
              </>
            )}
          </View>
        );
      },
      headerRight: () => {
        return (
          <View style={{ ...styles.headerContainer, paddingRight: 15 }}>
            {
              !groupName &&
              <TouchableOpacity onPress={()=>Linking.openURL(`tel:${selectedUserData.number}`)}>
              <Feather name="phone-call" size={25} color="#fff" style={{marginRight:15,}} />
            </TouchableOpacity>
            }
            <TouchableOpacity 
                  onPress={groupName?
                       ()=>navigation.navigate("ChatSettingScreen",{chatId}):
                       ()=>navigation.navigate("Contact",{otherUserUid :selectedUserData.uid})
            }
            >
              <Feather name="settings" size={25} color="#fff" />   
            </TouchableOpacity>
          </View>
        );
      },
    });
  }, [selectedUserData,groupName,groupProfilePic]);

  const SendMessageHandler = useCallback(async () => {
    try {
      let allChatUsersUid = await allChatUsers?.map((e) => e.uid);
      if (!chatId) {
        // console.log(allChatUsersUid);
        let newChatId;
        if(groupName){
           newChatId = await SaveNewChat(
             loggedInUserData.uid,
             allChatUsersUid,
             groupName,
             groupProfilePic
           ).key;
        }else{
          newChatId = await SaveNewChat(
            loggedInUserData.uid,
            allChatUsersUid,
          ).key;
        }
  
        await setChatId(newChatId);
        await sendMessage(
          newChatId,
          loggedInUserData,
          messageText,
          replyingTo && replyingTo.key,
          null,
          null,
          allChatUsersUid
        );
      } else {
        await sendMessage(
          chatId,
          loggedInUserData,
          messageText,
          replyingTo && replyingTo.key,
          null,
          null,
          allChatUsersUid
        );
      }
      setReplyingTo(null);
      setMessageText("");
    } catch (error) {
      if (error == "Error: PERMISSION_DENIED: Permission denied")
        [Alert.alert("permission Denied🙁", "please logout any login again")];
      console.log("Error" + error);
      setMessageFailed("message Sending failed");
      setTimeout(() => {
        setMessageFailed("");
      }, 5000);
    }
  }, [chatId, messageText,groupName,groupProfilePic]);

  const pickImage = useCallback(async () => {
    try {
      let tempURI = await launchImagePicker();
      if (!tempURI) {
        return;
      }
      setTempImageURI(tempURI);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageURI]);

  const takePhoto = useCallback(async () => {
    try {
      let tempURI = await launchCamera();
      if (!tempURI) {
        return;
      }
      setTempImageURI(tempURI);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageURI]);

  const sendChatImage = useCallback(async () => {
    setIsLoading(true);
    try {
      let allChatUsersUid = await allChatUsers?.map((e) => e.uid);
      if (!chatId) {
        // console.log(allChatUsersUid);
        let newChatId = await SaveNewChat(
          loggedInUserData.uid,
          allChatUsersUid
        ).key;
        await setChatId(newChatId);
      }
      const uploadURL = await uploadImage(tempImageURI, true);
      setTempImageURI(null);
      await setIsLoading(false);
      // SEND IMAGE MESSAGE
      const sendImageMessage = await sendMessage(
        chatId,
        loggedInUserData,
        "Image",
        replyingTo && replyingTo.key,
        uploadURL.URL,
        null,
        allChatUsersUid
      );
      setReplyingTo(null);
      console.log("Image uploaded successfully🤗");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }, [isLoading, tempImageURI, chatId]);

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ImageBackground source={BackgroundImage} style={styles.image}>
        <View style={styles.innerContainer}>
          {!chatId && <ErrorBubble text="No messages yet😶. say HI👋" />}
          {messageFailed !== "" && (
            <View>
              <ErrorBubble
                text="Failed to Send Message🙁"
                style={{ color: "red" }}
              />
              <ErrorBubble
                text="Please Check your Internet connectivity 📶 and try again"
                style={{ color: "red", fontSize: 13 }}
              />
            </View>
          )}
           {
            allMessageData.length > 0 ?
            <FlatList
            ref ={(ref)=>flatlist.current=ref}
            onContentSizeChange={()=>flatlist.current.scrollToEnd({animated:false})}
            onLayout={()=>flatlist.current.scrollToEnd({animated:false})}
            data={allMessageData}
            renderItem={(e) => {
              // console.log(e.item)
              return (
                <MessageBubble
                  data={e.item}
                  loggedInUserUid={loggedInUserData.uid}
                  chatId={chatId}
                  setReply={() => setReplyingTo(e.item)}
                  replyingTo={
                    e.item.replyTo &&
                    messageData?.find((i) => i.key === e.item.replyTo)
                  }
                />
              );
            }}
            showsVerticalScrollIndicator={false}
          />
          :
          <View style={{alignSelf:"center",backgroundColor:"#fff",marginTop:20,elevation:10,borderRadius:10,}}>
            <Text style={{fontSize:17,fontFamily:"Medium",paddingHorizontal:30,paddingVertical:5,color:"#6f4e37"}}> No Messages yet😶, Say HI👋</Text>
          </View>
           }
        </View>
      </ImageBackground>

      {
        //  REPLYING CONTAINER ==============================>
        replyingTo && (
          <View style={styles.replyContainer}>
            <View
              style={{
                alignSelf: "center",
                marginRight: 20,
                alignItems: "center",
              }}
            >
              <Image
                source={{
                  uri: storedUsers[replyingTo.sentBy]?.ProfilePicURL,
                }}
                style={styles.userImage}
                resizeMode="contain"
              />
              <Text style={styles.replyName}>
                {storedUsers[replyingTo.sentBy]?.name}
              </Text>
            </View>
            {replyingTo.text === "Image" && replyingTo.imageURL ? (
              <Image
                source={{ uri: replyingTo.imageURL }}
                style={{ width: 220, height: 200, marginVertical: 10 }}
              />
            ) : (
              <View style={styles.replyTextContainer}>
                <Text style={styles.replyText} numberOfLines={1}>
                  {replyingTo.text}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.replyCancelButton}
              onPress={() => setReplyingTo()}
            >
              <AntDesign name="closecircleo" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )
      }

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="add-circle-outline" size={35} color="#FFF" />
        </TouchableOpacity>
        <TextInput
          placeholder="Type your message here"
          style={styles.textBox}
          selectionColor={"#6f4e37"}
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          onSubmitEditing={() => SendMessageHandler()}
          keyboardAppearance="light"
        />

        {
          //////////   CHANGING TO ICON WHEN SOMETHING IS TYPED IN INPUT BOX  ////////////////////////
          messageText ? (
            <TouchableOpacity onPress={() => SendMessageHandler()}>
              <Ionicons name="send-sharp" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => takePhoto()}>
              <Feather name="camera" size={32} color="#FFF" />
            </TouchableOpacity>
          )
        }
        <AwesomeAlert
          show={tempImageURI !== null}
          title="send image ?🤔 "
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="cancel"
          confirmText="send"
          confirmButtonColor="#6f4e37"
          cancelButtonColor="red"
          titleStyle={styles.popUpTitleStyle}
          onCancelPressed={() => setTempImageURI(null)}
          onDismiss={() => setTempImageURI(null)}
          onConfirmPressed={() => sendChatImage()}
          contentContainerStyle={styles.popUpContainer}
          customView={
            <View style={{ borderRadius: 20 }}>
              {isLoading && tempImageURI !== null && (
                <ActivityIndicator color="#6f4e37" size={40} />
              )}
              {!isLoading && tempImageURI !== null && (
                <Image
                  source={{ uri: tempImageURI }}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    flex: 1,
  },
  innerContainer: {
    flexDirection: "column-reverse",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
  },
  userImage: {
    width: 40,
    height: 40,
    marginLeft: 5,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#6f4e37",
  },
  userName: {
    fontSize: 20,
    marginLeft: 10,
    color: "#fff",
    fontFamily: "Bold",
    letterSpacing: 1,
    alignSelf: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6F4E37",
    paddingVertical: 10,
    paddingHorizontal: 10,
    height: 60,
  },
  textBox: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#fff",
    paddingLeft: 15,
    paddingRight: 15,
    width: "70%",
    color: "#6f4e37",
    fontSize: 16,
    fontWeight: "bold",
  },
  replyContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    padding: 5,
    backgroundColor: "#6f4e37",
    borderLeftWidth: 4,
    borderColor: "#fff",
  },
  replyName: {
    fontFamily: "Bold",
    fontSize: 16,
    color: "#fff",
  },
  replyTextContainer: {
    width: "60%",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  replyText: {
    fontSize: 15,
    fontFamily: "BoldItalic",
    color: "#6f4e37",
    //  backgroundColor:"#fff",
  },
  replyCancelButton: {
    position: "absolute",
    alignSelf: "flex-start",
    right: 5,
    top: 5,
    // marginLeft:5,
  },
  popUpContainer: {
    backgroundColor: "#FFBF00",
    borderWidth: 5,
    borderColor: "#6f4e37",
    borderRadius: 10,
  },
  popUpTitleStyle: {
    fontFamily: "Medium",
    letterSpacing: 1,
    color: "#6f4e37",
    marginBottom: 6,
  },
});
