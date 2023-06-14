import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import BackgroundImage from "../assets/images/chatScreenBackground.png";
import { TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather,FontAwesome  } from "@expo/vector-icons";

const ChatScreen = () => {

    const [messageText, setMessageText] = useState("");

    const SendMessageHandler = ()=> {
        console.log(messageText);
        setMessageText("");
    }

    const CameraHandler = () => {
        console.log("Camera opening ...📸")
    }
    

  return (
    <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
      <ImageBackground
        source={BackgroundImage}
        style={styles.image}
      ></ImageBackground>
      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={35} color="#FFF" />
        </TouchableOpacity>
        <TextInput style={styles.textBox} selectionColor={"#6f4e37"} value={messageText} onChangeText={(text)=>setMessageText(text)} onSubmitEditing={()=>SendMessageHandler()}/>

        {
         //////////   CHANGING TO ICON WHEN SOMETHING IS TYPED IN INPUT BOX  ////////////////////////
          messageText ? (
            <TouchableOpacity onPress={()=>SendMessageHandler()}>
           <FontAwesome name="send-o" size={32} color="#FFF" />
          </TouchableOpacity>
          ):(
            <TouchableOpacity onPress={()=>CameraHandler()}>
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
    fontWeight:"bold",
    
  },
});
