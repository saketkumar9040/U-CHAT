import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SignUpScreen from "../screens/SignUpScreen";
import SignInScreen from "../screens/SignInScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
      <Stack.Navigator
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