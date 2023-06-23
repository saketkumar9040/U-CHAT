import React from "react";

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
    <Stack.Group screenOptions={{presentation:'modal'}}>
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
  )
};

const MainNavigator = () => {
  return (
   <StackNavigator/>
  );
};

export default MainNavigator;
