import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import BackgroundImage from "../assets/images/chatScreenBackground.png";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, FontAwesome, AntDesign } from "@expo/vector-icons";
import userProfilePic from "../assets/images/userProfile.png";
import { useSelector } from "react-redux";
import Bubble from "../components/Bubble";
import { SaveNewChat } from "../components/SaveNewChat";
import { saveMessage } from "../utils/ChatHandler";

const ChatScreen = ({ navigation, route }) => {

  const [messageText, setMessageText] = useState("");
  const [chatId, setChatId] = useState(route?.params?.chatId);

  let loggedInUserData = useSelector((state) => state.auth.userData);
  // console.log(loggedInUserData.uid)

  let allChatUsers = route?.params?.chatUsers;
  // console.log("all chat users"+JSON.stringify(allChatUsers));

  let selectedUserData = allChatUsers.find((e)=>e.uid !== loggedInUserData.uid);
  // console.log(selectedUserData)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
              <AntDesign name="arrowleft" size={25} color="#fff" />
            </TouchableOpacity>
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
          </View>
        );
      },
    });
  }, [selectedUserData]);

  const SendMessageHandler = useCallback(async () => {
      try {
        if (!chatId) {
          let allChatUsersUid =await allChatUsers?.map((e)=>e.uid);
          // console.log(allChatUsersUid);
          let newChatId = await SaveNewChat(loggedInUserData.uid, allChatUsersUid);
           setChatId(newChatId);
        }
        await saveMessage(chatId,loggedInUserData.uid,messageText)
      } catch (error) {
        console.log(error);
      }  
      setMessageText("");
  },[chatId,messageText])

  const CameraHandler = () => {
    console.log("Camera opening ...📸");
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ImageBackground source={BackgroundImage} style={styles.image}>
        {!chatId && <Bubble text="No messages yet😶. say HI👋" />}
      </ImageBackground>
      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={35} color="#FFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.textBox}
          selectionColor={"#6f4e37"}
          value={messageText}
          onChangeText={(text) => setMessageText(text)}
          onSubmitEditing={() => SendMessageHandler()}
        />

        {
          //////////   CHANGING TO ICON WHEN SOMETHING IS TYPED IN INPUT BOX  ////////////////////////
          messageText ? (
            <TouchableOpacity onPress={() => SendMessageHandler()}>
              <Ionicons name="send-sharp" size={28} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => CameraHandler()}>
              <Feather name="camera" size={32} color="#FFF" />
            </TouchableOpacity>
          )
        }
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
    paddingVertical: 10,
    backgroundColor: "#fff",
    paddingLeft: 15,
    paddingRight: 15,
    width: "70%",
    color: "#6f4e37",
    fontSize: 16,
    fontWeight: "bold",
  },
});
