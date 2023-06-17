import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useSelector } from "react-redux";




const AppNavigator = () => {

  const isAuth =useSelector(state=>state.auth.token !== null && state.auth.token !== "");
  console.log(isAuth);
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


