import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/ChatListScreen";
import ChatSettingScreen from "../screens/ChatSettingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import ChatScreen from "../screens/ChatScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        tabBarStyle: {
          backgroundColor: "#6F4E37",
        },
        headerStyle: { backgroundColor: "#6F4E37" },
      }}
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
              size={size}
              color={focused === false ? "white" : "#b8b8ba"}
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
              size={size}
              color={focused === false ? "white" : "#b8b8ba"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        // tabBarStyle: {
        //   backgroundColor: "#6F4E37",

        // },
        contentStyle: {
          backgroundColor: "#6F4E37",
        },
      }}
    >
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
          headerTitle:"",
          headerBackTitle:"back",
          headerStyle:{
            backgroundColor:"#6F4E37",
            
          },
          headerTintColor: '#ffffff'
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
    </Stack.Navigator>
  );
};

export default MainNavigator;

const styles = StyleSheet.create({});
