import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/images/navigatorBackground2.jpg";
import { useSelector } from "react-redux";
import { Ionicons, FontAwesome, AntDesign,MaterialIcons,MaterialCommunityIcons, Entypo  } from "@expo/vector-icons";

const ChatListScreen = ({ navigation, route }) => {

  const [isLoading,setIsLoading]=useState(true);

  const selectedUser = route?.params?.selectedUser;
  // console.log(JSON.stringify(selectedUser))

  const userLoggedIn = useSelector((state) => state.auth.userData);
  // console.log(userLoggedIn);

  const storedUser = useSelector((state) => state?.users?.storedUser);
  // console.log("stored user "+JSON.stringify(storedUser))

  const userChats = useSelector((state) => state.chats.chatsData);
  // console.log(Object.values(userChats));
  let chatData = Object.values(userChats).sort((a,b)=>{
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });
  // console.log(chatData)



  const dayNames = ["Sun", "Mon", "Tue","Wed","Thr","Fri","Sat"];
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"];

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              marginRight: 20,
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("NewChatScreen")}
          >
            <FontAwesome name="search" size={26} color="#fff" />
          </TouchableOpacity>
        );
      },
      headerLeft: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              marginLeft: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 23,
                fontFamily: "BoldItalic",
                color: "#fff",
                letterSpacing: 2,
                paddingRight: 10,
              }}
            >
              U-CHAT
            </Text>
            <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
          </View>
        );
      },
    });
  }, []);

  useEffect(() => {
    //  console.log(selectedUser);
    if (!selectedUser) {
      return;
    }
    let alreadyChatWith = chatData.find((e)=>e.users[0]===selectedUser?.uid);
    console.log(alreadyChatWith?.key);

    const chatUsers = [selectedUser, userLoggedIn];

    navigation.navigate("ChatScreen", { chatUsers: chatUsers,chatId:alreadyChatWith?.key });
  }, [selectedUser]);
    
  return (
          <View style={styles.container}>
          { chatData.length===0  ? (
                <View style={styles.userContainer}>
                <Text style={{...styles.noUserText,fontSize:40}}>No user yet !</Text>
                <Entypo name="emoji-sad" size={180} color="#6f4e37" style={{marginVertical:30,}}/>
                <Text style={styles.noUserText}>Search for </Text>
                <Text style={styles.noUserText}>{`>>>      Family👪` }</Text>
                <Text style={styles.noUserText}>{`>>>      Friends😎`}</Text>
                <Text style={styles.noUserText}>{`>>>      Groups👩‍👩‍👧‍👦`}</Text>
              </View>
          ):(
            <FlatList
            style={styles.chatUserContainer}
            data={chatData}
            renderItem={(e) => {
              // console.log(e.item);
              let displayDate ;
              let date = new Date(e.item.updatedAt);
              if(date.getHours()===0){
                 displayDate = 12
              }else{
                displayDate =  date.getHours() > 12
                    ? date.getHours()-12
                    : date.getHours()
                    // console.log(date);
              }
              const otherUsersId = e.item.users.find(
                (uid) => uid !== userLoggedIn.uid
              );
              const otherUser = storedUser[otherUsersId];
              // console.log(otherUser)
              // console.log(`otheruser : ${JSON.stringify(otherUser)}`)
              return (
                <TouchableOpacity
                  style={styles.searchResultContainer}
                  onPress={() => {
                    navigation.navigate("ChatScreen",{
                      chatUsers:[otherUser,userLoggedIn],
                      chatId:e.item.key
                    })
                  }}
                >
                  <Image
                    source={{ uri: otherUser?.ProfilePicURL }}
                    style={styles.searchUserImage}
                    resizeMode="contain"
                  />
                  <View style={styles.searchUserTextContainer}>
                    <Text style={styles.searchUserName}>
                      {otherUser?.name.toUpperCase()}
                    </Text>
                    <Text style={styles.latestMessageText}>{e?.item?.latestMessageText.substring(0,20)}</Text>
                  </View>
                  <View  style={styles.timeContainer}>
                    <Text style={styles.dateText}> {displayDate}:{date.getMinutes()>9?date.getMinutes():`0${date.getMinutes()}`} {date.getHours()>12?"PM":"AM"}</Text> 
                    <Text style={{...styles.dateText,fontSize:11}}>{dayNames[date.getDay()]},{date.getDate()}-{monthNames[date.getMonth()]}</Text> 
                    
                  </View>
                </TouchableOpacity>
              );
            }}
          />
          )
        }
        </View>
        )
};

export default ChatListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
  },
  activityContainer:{
    flex: 1,
    backgroundColor: "#ffbf00",
    alignItems:"center",
    justifyContent:"center",
  },
  chatUserContainer: {
    //  paddingHorizontal:10,
  },
  searchResultContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    // elevation:5,
    backgroundColor:"#ffbf00"
  },
  searchUserImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#6f4e37",
    backgroundColor: "#6f4e37",
    marginRight: 5,
  },
  searchUserTextContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  latestMessageText: {
    fontSize: 15,
    color: "#6f4e37",
    fontFamily: "Medium",
  },
  searchUserName: {
    fontSize: 22,
    color: "#6f4e37",
    fontFamily: "Bold",
  },
  timeContainer: {
    alignItems:"center",
    // flexDirection:"column",
     position:"absolute",
     right:20,
     top:15,
  },
  dateText:{
    fontSize:16,
    fontFamily:"SemiBold",
    color: "#6f4e37",
  },
  userContainer: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
  },
  noUserText: {
    fontSize: 22,
    paddingTop: 10,
    color: "#6f4e37",
    fontFamily: "Bold",
  },
});
