import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/ChatListScreen";
import ChatSettingScreen from "../screens/ChatSettingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import ChatScreen from "../screens/ChatScreen";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthNavigator = () => {
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
        initialRouteName="SignInScreen"
      >
        <Stack.Screen
          name="SignInScreen"
          component={SignInScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ headerShown: false }}
     
        />
      </Stack.Navigator>
    );
  };
  
  export default AuthNavigator;