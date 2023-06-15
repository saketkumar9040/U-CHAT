import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";

import AuthNavigator from "./AuthNavigator";


const AppNavigator = () => {
  const isAuth = false;
  return (
    <NavigationContainer style={{ backgroundColor: "#6F4E37" }}>
        {
          isAuth ?(
            <MainNavigator/>
          ):(
            <AuthNavigator/>
          )
        }
    </NavigationContainer>
  );
};

export default AppNavigator;


