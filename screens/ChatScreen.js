import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackgroundImage from "../assets/images/chatScreenBackground.png";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather, FontAwesome, AntDesign } from "@expo/vector-icons";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import userProfilePic from "../assets/images/userProfile.png"
import { useSelector } from "react-redux";
import Bubble from "../components/Bubble";

const ChatScreen = ({ navigation, route }) => {

  const[hasChat,setHasChat] = useState(false);
  const [messageText, setMessageText] = useState("");

  // console.log(route?.params)
  let userData = route?.params?.userData;
  const storedUser = useSelector(state=>state.users.storedUser);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={()=>navigation.navigate("ChatList")}>
              <AntDesign name="arrowleft" size={25} color="#fff" />
            </TouchableOpacity>
            <Image
              source={userData?.ProfilePicURL?{ uri: userData?.ProfilePicURL }:userProfilePic}
              style={styles.userImage}
              resizeMode="contain"
            />
            <Text style={styles.userName}>{userData?.name}</Text>
          </View>
        );
      },
    });
  }, []);

  useEffect(()=>{
    // if(storedUser[userData.uid]){
    //   console.log("already has a conversation with the user.🤗")
    //   setHasChat(true)
    // }else{
    //   console.log("new user,I have to chat🙄");
    // }
  },[storedUser])

  

  const SendMessageHandler = () => {
    console.log(messageText);
    setMessageText("");
  };

  const CameraHandler = () => {
    console.log("Camera opening ...📸");
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ImageBackground
        source={BackgroundImage}
        style={styles.image}
      >
      {
        !hasChat &&(
           <Bubble text="No messages yet😶. say HI👋"/>
           )
      }
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
              <FontAwesome name="send-o" size={32} color="#FFF" />
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
