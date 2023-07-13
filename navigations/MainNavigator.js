import React, {  useEffect, useRef, useState } from "react";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/ChatListScreen";
import ChatSettingScreen from "../screens/ChatSettingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { useDispatch, useSelector } from "react-redux";
import { child, get, getDatabase, off, onValue, ref } from "firebase/database";
import { app, db } from "../firebase/FirebaseConfig";
import { setChatData } from "../store/chatSlice";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { setStoredUsers } from "../store/userSlice";
import { setStarredMessages, setStoredMessage } from "../store/messageSlice";
import ContactScreen from "../screens/ContactScreen";

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
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#6F4E37",
            },
          }}
        />
        <Stack.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            gestureEnabled: true,
            headerTitle: "",
            headerStyle: {
              backgroundColor: "#6F4E37",
            },
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

  //   PUSH NOTIFICATION START =========================================================>

  const [expoPushToken, setExpoPushToken] = useState('');
  // console.log(expoPushToken);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // HANDLE PUSH NOTIFICATION ===================>
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log("Notification tapped :");
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  

  //  PUSH NOTIFICATION END'S =====================================================>


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

        onValue(chatRef, async(chatSnapshot) => {
          chatsFoundCount++;
      
          const data = chatSnapshot.val();
          // console.log(data)
          if(data){
            if(!data.users.includes(userData.uid)){
              return;
            }
            data.key = chatSnapshot.key;
            data.users.forEach(async(userId)=>{
              if(storedUsers[userId]){
                return;
              }
              const userRef = child(dbRef,`UserData/${userId}`);
              await get(userRef).then(async(userSnapshot)=>{
                  //  console.log(userSnapshot.val());
                   if(userSnapshot.val().uid === userData.uid){
                    return;
                   }
                   const userSnapshotData = userSnapshot.val();
                  //  console.log(userSnapshotData)
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

//   RETREVING  MESSAGES FROM DATABASE =======================================>

      const messageRef = child(dbRef,`Messages/${chatId}`);
      refs.push(messageRef);  //  FOR UNSUBSCRIBING FROM FIREBASE //   
      
      onValue(messageRef,async(messageSnapshot)=>{
        const messageData = messageSnapshot.val();
        await dispatch(setStoredMessage({chatId,messageData}))
      });

//    IF NO CHATS ARE FOUND   //===============================================>
        if(chatsFoundCount===0){ 
          setIsLoading(false);
        }
      }
      // console.log(chatIds);
    });
//  RETREVING USER STARRED MESSAGES  ===========================================>

    const userStarredMessageRef = child(dbRef,`StarredMessages/${userData.uid}`)
    refs.push(userStarredMessageRef);
    onValue(userStarredMessageRef,querySnapshot=>{
      const starredMessages = querySnapshot.val() ?? {}
      dispatch(setStarredMessages({starredMessages}))
    })
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


export const registerForPushNotificationsAsync = async()=> {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: '31e16bb3-9f3b-4ccf-9d06-d97345783a30',
    })).data;
    // console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

