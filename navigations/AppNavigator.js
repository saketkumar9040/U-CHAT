import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import MainNavigator from "./MainNavigator";
import AuthNavigator from "./AuthNavigator";
import { useDispatch, useSelector } from "react-redux";
import StartUpScreen from "../screens/StartUpScreen";
import * as Updates from 'expo-updates';
import { removePushToken } from "../utils/tokenHandler";
import { autoLogout } from "../store/authSlice";
import { Alert, Button, Text, View } from "react-native";
import NetInfo from '@react-native-community/netinfo'
import NoInternetScreen from "../screens/NoInternetScreen";

const AppNavigator = () => {
  const dispatch = useDispatch();
  const userData = useSelector(state => state.auth.userData);

  // CHECKING INTERNET CONNECTIVITY START ===================================>

  const [networkStatus,setNetworkStatus]= useState(false)

  const unsubscribe = () => NetInfo.addEventListener(state => {
    // setNetworkStatus(state.isConnected)
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
  });
  useEffect(()=>{
    unsubscribe();
  },[])
  

  //  EXPO UPDATES  START ===================================================>
  const onFetchUpdateAsync = async() =>{
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
        await removePushToken(userData);
        await dispatch(autoLogout());
        Alert.alert("App got a new update,please login again😊")
      }
    } catch (error) {
      if(error.message == 
        "You cannot check for updates in development mode. To test manual updates, publish your project using `expo publish` and open the published version in this development client."){
         console.log(error.message)
      }else{
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        alert(`Error fetching latest Expo update: ${error}`);
        console.log(error);
      }
      // You can also add an alert() to see the error message in case of an error when fetching updates.
    }
  };
  onFetchUpdateAsync();
  //   EXPO UPDATES END =========================================================>

  const isAuth = useSelector( (state) => state.auth.token !== null && state.auth.token !== "");
  const didTryAutoLogin = useSelector((state)=>state.auth.didTryAutoLogin)
  // console.log(isAuth);
  return (
    <NavigationContainer style={{ backgroundColor: "#6F4E37" }}>
      {!networkStatus && <NoInternetScreen props={unsubscribe}/>}
      {isAuth && networkStatus && <MainNavigator />}
      {!isAuth && networkStatus && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && networkStatus && <StartUpScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
