import { StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import {authenticate, autoLogin ,autoLogout} from "../store/Slice"
import { child, get, getDatabase, ref } from "firebase/database";
import { app } from "../firebase/FirebaseConfig"


const StartUpScreen = () => {
  const dispatch = useDispatch();
  // AsyncStorage.clear()

  useEffect(() => {
    const storedAuthInfo = async () => {
      const getStoredAuthInfo = await AsyncStorage.getItem("userData");
      // console.log(getStoredAuthInfo);

      //  IF  NO  DATA IN THE LOCAL STORAGE  ==============================>
      if (!getStoredAuthInfo) {
        dispatch(autoLogin())
        return;
      }

      //  CHECKING TOKEN EXPIRY  ===========================================>
      const parsedData = JSON.parse(getStoredAuthInfo);
      // console.log(parsedData);
      const { accessToken,uid,expiryDate:expiryDateString} = parsedData;
      const expiryDate = new Date(expiryDateString)
      if(expiryDate <= new Date() || !accessToken || !uid ){
        dispatch(autoLogin())
        return;
      }

      //  GETTING USER DATA FROM  FIREBASE  ===================================>
    try {
        const dbRef = ref(getDatabase(app));
        const userRef = child(dbRef,`UserData/${uid}`);
        const snapshot = await get(userRef)
        let userData = snapshot.val();

        //  SENDING DATA TO LOCAL STORE  ============================================>
        dispatch(authenticate({token:accessToken,userData}));

    } catch (error) {
        console.log(error)
    }
    };
    storedAuthInfo();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={110} color="#fff" />
    </View>
  );
};

export default StartUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6f4e37",
  },
});
