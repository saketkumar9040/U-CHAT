import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useSelector } from "react-redux";
import StartUpScreen from "../screens/StartUpScreen";

const AppNavigator = () => {
  const isAuth = useSelector( (state) => state.auth.token !== null && state.auth.token !== "");
  const didTryAutoLogin = useSelector((state)=>state.auth.didTryAutoLogin)
  // console.log(isAuth);
  return (
    <NavigationContainer style={{ backgroundColor: "#6F4E37" }}>
      {isAuth && <MainNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
