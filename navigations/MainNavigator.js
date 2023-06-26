import React, {  useEffect, useState } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/ChatListScreen";
import ChatSettingScreen from "../screens/ChatSettingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import ChatScreen from "../screens/ChatScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { useDispatch, useSelector } from "react-redux";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { app, db } from "../firebase/FirebaseConfig";
import { setChatData } from "../store/chatSlice";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { setStoredUsers } from "../store/userSlice";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        tabBarStyle: {
          backgroundColor: "#6F4E37",
          height: 60,
        },
        headerStyle: { backgroundColor: "#6F4E37" },
      }}
      initialRouteName="ChatlistScreen"
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chat",
          tabBarLabelStyle: {
            color: "white",
            fontSize: 15,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name="chatbubble-ellipses"
              size={focused === true ? 35 : size}
              color={focused === true ? "white" : "#b8b8ba"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarLabelStyle: {
            color: "white",
            fontSize: 15,
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Fontisto
              name="player-settings"
              size={focused === true ? 35 : size}
              color={focused === true ? "white" : "#b8b8ba"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: "#6F4E37",
        },
      }}
      initialRouteName="Home"
    >
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          options={{
            gestureEnabled: true,
            //   headerShown: false,
            headerTitle: "",
            headerBackTitle: "back",
            headerStyle: {
              backgroundColor: "#6F4E37",
            },
            headerTintColor: "#ffffff",
          }}
        />
        <Stack.Screen
          name="ChatSettingScreen"
          component={ChatSettingScreen}
          options={{
            gestureEnabled: true,
            headerTitle: "Settings",
          }}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen
          name="NewChatScreen"
          component={NewChatScreen}
          options={{
            gestureEnabled: true,
            headerStyle: {
              backgroundColor: "#6F4E37",
            },
            // headerBackTitle: "back",
            headerTintColor: "#ffffff",
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const MainNavigator = () => {

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUser);
  // console.log(storedUsers)

  useEffect(() => {
    // console.log("subscribing to firebase listener");
    const dbRef = ref(getDatabase(app));
    const userChatRef = child(dbRef, `UsersChats/${userData.uid}`);
    let refs = [userChatRef];
    onValue(userChatRef, (querySnapshot) => {
      const chatIdsData = querySnapshot.val() || {};
      const chatIds = Object.values(chatIdsData);

      const chatsData = {};
      let chatsFoundCount = 0;
      for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        const chatRef = child(dbRef, `Chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef, (chatSnapshot) => {
          chatsFoundCount++;
      
          const data = chatSnapshot.val();
          // console.log(data)
          if(data){
            data.key = chatSnapshot.key;

            data.users.forEach((userId)=>{
              if(storedUsers[userId]){
                return;
              }
              const userRef = child(dbRef,`UserData/${userId}`);
              get(userRef).then(async(userSnapshot)=>{
                  //  console.log(userSnapshot.val());
                   const userSnapshotData = userSnapshot.val();
                   await dispatch(setStoredUsers({newUsers:{userSnapshotData}}));
              })
              refs.push(userRef); 
            })

            chatsData[chatSnapshot.key] = data;
          }

          if (chatsFoundCount >= chatIds.length) {
            dispatch(setChatData({ chatsData }));
            setIsLoading(false);
          }
        });
//    IF NO CHATS ARE FOUND   //===============================================>
        if(chatsFoundCount===0){ 
          setIsLoading(false);
        }
      }
      // console.log(chatIds);
    });
    return () => {
      // console.log("unsubscribing from firebase listener");
      ref.forEach((ref) => off(ref));
    };
  }, []);

  if(isLoading===false){
    <View style={styles.activityContainer}>
      <ActivityIndicator
           size={80}
           color="#fff"
      />
    </View>
  }

  return <StackNavigator />;
};

export default MainNavigator;

const styles = StyleSheet.create({
  activityContainer:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
  }
})
