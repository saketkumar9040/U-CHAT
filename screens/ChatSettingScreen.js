import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { AntDesign, Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import groupPic from "../assets/images/group.png";
import ProfileImage from "../components/ProfileImage";
import { TextInput } from "react-native";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { child, getDatabase, ref, update } from "firebase/database";
import { app } from "../firebase/FirebaseConfig";
import { Alert } from "react-native";
import { setChatData, updateChatData } from "../store/chatSlice";
import userProfilePic from "../assets/images/group.png";
import { removeFromChat, sendMessage } from "../utils/ChatHandler";
import { useCallback } from "react";

const ChatSettingScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const chatId = route?.params?.chatId;
  const chatData = useSelector((state) => state.chats.chatsData[chatId] || {});
  // console.log(chatData);
  const userData = useSelector((state) => state.users.storedUser);
  // console.log(userData);
  const loggedInUser = useSelector((state) => state.auth.userData);
  // console.log(loggedInUser)

  const [groupName, setGroupName] = useState(chatData.groupName);
  // console.log(groupName)
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(!chatData){
      return ;
    }
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

  const submitHandler = async () => {
    if (groupName == "") {
      Alert.alert("group name cannot be empty😵");
      return;
    }
    try {
      setIsLoading(true);
      let updatedGroupData = {
        ...chatData,
        groupName: groupName,
        updatedAt: new Date().toISOString(),
      };
      // console.log(updatedgroupData)
      let newChatData = {};
      newChatData[chatId] = updatedGroupData;
      const dbRef = ref(getDatabase());
      const chatRef = child(dbRef, `Chats/${chatId}`);
      await update(chatRef, updatedGroupData);
      Alert.alert("Profile Updated Successfully🤗");
      await dispatch(updateChatData({ newChatData }));
      setIsLoading(false);
      setHasChanges(false);
    } catch (error) {
      setIsLoading(false);
      setHasChanges(false);
      Alert.alert("Unable to update profile,please try again😔");
      console.log(error);
    }
  };

  const leaveChat = useCallback(async()=>{
    try {
      setIsLoading(true);
      await removeFromChat(loggedInUser.uid,loggedInUser.uid,chatData);
      Alert.alert("User removed successfully")
      let message=`${loggedInUser.name} left the chat`
      await sendMessage(chatData.key,loggedInUser.uid,message,null,null,"Info")
      navigation.popToTop()
    } catch (error) {
       setIsLoading(false)
       console.log(error)
    }
  },[navigation,isLoading]);

  if(!chatData.users){
    return null;
  }
  return (
  <>
  {
    chatData =={} || !chatData?(
      <View style={{flex:1,alignItems:"center",justifyContent:"center",backgroundColor:"#ffbf00"}}>
        <ActivityIndicator size={200} color="#6f4e37"/>
        <Text style={{fontSize:40,fontFamily:"Bold",color:'#6f4e37',letterSpacing:2,}}>LOADING...</Text>
      </View>
    ):(
      <>
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
          onBlur={() => {
            if (groupName == chatData?.groupName) {
              setHasChanges(false);
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
      <View>
        <Text style={styles.commonChatsText}>Group member's👩‍👩‍👧‍👦</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              height: 2,
              backgroundColor: "#6f4e37",
              marginBottom: 10,
            }}
          />
        </View>
        <TouchableOpacity 
                style={styles.newGroupContainer} 
                onPress={()=>navigation.navigate("NewChatScreen",{isGroupChat :true,chatId})}
            >
             <Ionicons name="person-add" size={23} color="#6f4e37" />
              <Text style={styles.newGroupText}>Add user</Text>
            </TouchableOpacity>
        {chatData.users.map((uid) => {
          let currentUserData ;
          if(uid ===loggedInUser.uid){
            currentUserData=loggedInUser
          }else{
            currentUserData = userData[uid];
          }
         
          return (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              key={uid}
            >
              <TouchableOpacity
                style={styles.searchResultContainer}
                onPress={currentUserData?.uid!== loggedInUser?.uid ? async() => {
                  // console.log(Object.values(allChatData))
                    navigation.navigate("Contact", {
                      otherUserUid :currentUserData?.uid,
                      chatId
                    });
                }:()=>Alert.alert("It's Me 😎😎😎")}
              >
                <Image
                  source={
                    currentUserData?.ProfilePicURL
                      ? { uri: currentUserData?.ProfilePicURL }
                      : userProfilePic
                  }
                  style={styles.searchUserImage}
                  resizeMode="contain"
                />
                <View style={styles.searchUserTextContainer}>
                  <Text style={styles.searchUserName}>
                    {currentUserData?.name ? currentUserData?.name : ""}
                  </Text>
                  <Text style={styles.latestMessageText}>{currentUserData?.about}</Text>
                </View>
               { currentUserData?.uid !==loggedInUser?.uid &&<AntDesign
                  name="rightcircleo"
                  size={24}
                  color="#6f4e37"
                  style={{ position: "absolute", right: 10 }}
                />}
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
    <View style={{backgroundColor:"#ffbf00"}}>
      <TouchableOpacity
        style={{...styles.buttonContainer,backgroundColor:"#ff0000",marginBottom:5,}}
        onPress={()=>leaveChat()}
      >
        {isLoading ? (
          <ActivityIndicator size={32} color="#fff" />
        ) : (
          <Text style={{...styles.buttonText,fontSize:13,}}>LEAVE CHAT</Text>
        )}
      </TouchableOpacity>
    </View>
      </>
    )
  }
  </>

  );
};

export default ChatSettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems:"center",
    // justifyContent:"center",
    backgroundColor: "#ffbf00",
    // paddingTop: 20,
    // paddingBottom:50,
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
    // paddingVertical: 5,
    marginVertical: 10,
    fontSize: 17,
    backgroundColor: "#fff",
    marginLeft: 10,
    fontFamily: "BoldItalic",
    letterSpacing: 1,
    textAlign: "center",
  },
  buttonContainer: {
    width: "45%",
    // height: 50,
    // marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical:5,
    alignSelf: "center",
    backgroundColor: "green",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    alignSelf: "center",
    fontFamily:"Medium",
    letterSpacing: 2,
  },
  mainButtonContainer: {
    alignItems: "center",
    alignSelf:"center",
    // position: "absolute",
    // bottom: 5,
  },
  commonChatsText: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 20,
    fontFamily: "Bold",
    letterSpacing: 1,
    color: "#6f4e37",
    alignSelf: "flex-start",
  },
  searchResultContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems:"center",
    alignSelf: "flex-start",
    // height: 80,
    paddingHorizontal: 10,
    // marginTop:10,
    marginHorizontal: 5,
    marginVertical:5,
    // elevation:5,
  },
  searchUserImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#6f4e37",
    marginRight: 5,
  },
  searchUserTextContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  latestMessageText: {
    fontSize: 11,
    color: "#6f4e37",
    fontFamily: "MediumItalic",
  },
  searchUserName: {
    fontSize: 18,
    color: "#6f4e37",
    fontFamily: "Bold",
  },
  newGroupContainer:{
    flexDirection:"row",
    alignItems:"center",
     alignSelf:"center",
     paddingHorizontal:20,
     paddingVertical:3,
     backgroundColor:"white",
     borderWidth:3,
     borderColor:"#6f4e37",
     borderRadius:40,
     
  },
  newGroupText:{
    marginLeft:5,
    fontSize: 14,
    color: "#6f4e37",
    fontFamily: "Bold",
  },
});
