import { ImageBackground, StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthScreen from "../screens/AuthScreen";


const AppNavigator = () => {
  const isAuth = false;
  return (
    <NavigationContainer style={{ backgroundColor: "#6F4E37" }}>
        {
          isAuth ?(
            <MainNavigator/>
          ):(
            <AuthScreen/>
          )
        }
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
