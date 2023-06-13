import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "../screens/ChatListScreen";
import ChatSettingScreen from "../screens/ChatSettingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Ionicons, Fontisto } from "@expo/vector-icons";

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
              color={focused === false ? "white" :"#b8b8ba"}
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
              color={focused === false ? "white" :"#b8b8ba"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer style={{ backgroundColor: "#6F4E37" }}>
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
          name="ChatSettingScreen"
          component={ChatSettingScreen}
          options={{
            gestureEnabled: true,
            headerTitle: "Settings",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
