import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import groupPic from "../assets/images/group.png";
import ProfileImage from "../components/ProfileImage";
import { TextInput } from "react-native";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { child,getDatabase,ref,update } from "firebase/database";
import { app } from "../firebase/FirebaseConfig";
import { Alert } from "react-native";
import { setChatData, updateChatData } from "../store/chatSlice";

const ChatSettingScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const chatId = route?.params?.chatId;
  const chatData = useSelector((state) => state.chats?.chatsData[chatId]);
  console.log(chatData);

  const [groupName, setGroupName] = useState(chatData?.groupName);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <AntDesign name="arrowleft" size={25} color="#fff" />
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: 10,
                fontSize: 25,
                fontFamily: "Bold",
                color: "#fff",
              }}
            >
              Chat settings
            </Text>
          </View>
        );
      },
    });
  }, []);

  const submitHandler = async() => {
    if(groupName ==""){
      Alert.alert("group name cannot be empty😵");
      return;
    }
    try {
      setIsLoading(true);
      let updatedGroupData={
        ...chatData,
        groupName:groupName,
        updatedAt:new Date().toISOString()
      }
      // console.log(updatedgroupData)
      let newChatData = {};
      newChatData[chatId]=updatedGroupData;
      const dbRef = ref(getDatabase());
      const chatRef = child(dbRef,`Chats/${chatId}`);
      await update(chatRef,updatedGroupData);
      Alert.alert("Profile Updated Successfully🤗");
      await dispatch(updateChatData({newChatData}));
     setIsLoading(false);
     setHasChanges(false);
    } catch (error) {
      setIsLoading(false);
      setHasChanges(false)
      Alert.alert("Unable to update profile,please try again😔")
      console.log(error);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <ProfileImage chatId={chatId} />
      <View style={styles.inputContainer}>
        <FontAwesome name="group" size={28} color="#fff" />
        <TextInput
          placeholder="Enter Group Name"
          placeholderTextColor="#6f4e37"
          autoCapitalize="none"
          style={styles.textInput}
          selectionColor="#6f4e37"
          value={groupName}
          onChangeText={(e) => {
            setHasChanges(true);
            setGroupName(e);
          }}
          onBlur={()=>{
            if( groupName == chatData?.groupName ){
              setHasChanges(false)
            } 
          }}
        />
      </View>
      <View style={styles.mainButtonContainer}>

            {hasChanges && (
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={submitHandler}
              >
                {isLoading ? (
                  <ActivityIndicator size={30} color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>SAVE</Text>
                )}
              </TouchableOpacity>
            )}
      </View>
    </ScrollView>
  );
};

export default ChatSettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems:"center",
    // justifyContent:"center",
    backgroundColor: "#ffbf00",
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 5,
    backgroundColor: "#6f4e37",
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: 15,
    padding: 5,

    width: 140,
    height: 140,
    borderRadius: 80,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 80,
    borderWidth: 3,
    borderColor: "#6f4e37",
    backgroundColor: "#6f4e37",
  },
  userName: {
    marginTop: 10,
    fontSize: 25,
    fontFamily: "Bold",
    color: "#6f4e37",
    textAlign: "center",
  },
  userAbout: {
    marginTop: 15,
    fontSize: 20,
    fontFamily: "Bold",
    color: "#6f4e37",
    textAlign: "center",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6f4e37",
    marginVertical: 15,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingLeft: 15,
    borderRadius: 10,
  },
  textInput: {
    width: "90%",
    color: "#000",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: 20,
    backgroundColor: "#fff",
    marginLeft: 10,
    fontFamily: "BoldItalic",
    letterSpacing: 2,
    textAlign: "center",
  },
  buttonContainer: {
    width: "45%",
    // height: 50,
    // marginTop: 20,
    padding: 10,
    alignSelf: "center",
    backgroundColor: "green",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    alignSelf: "center",
    fontWeight: 900,
    letterSpacing: 2,
  },
  mainButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    // position: "absolute",
    // bottom: 5,
  },
});
