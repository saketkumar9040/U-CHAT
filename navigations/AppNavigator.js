import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";

const AppNavigator = () => {
  return (
    <NavigationContainer style={{ backgroundColor: "#6F4E37" }}>
        <MainNavigator/>
    </NavigationContainer>
  );
};

export default AppNavigator;

const styles = StyleSheet.create({});
