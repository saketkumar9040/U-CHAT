import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { app } from "../firebase/FirebaseConfig";
import { child, get, getDatabase, ref, set } from "firebase/database";

const dbRef = ref(getDatabase(app));

export const savePushToken = async (userData) => {
  try {
    if (!Device.isDevice) {
      return;
    }
    const newToken = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "31e16bb3-9f3b-4ccf-9d06-d97345783a30",
      })
    ).data;

    // DESTRUCTURE BECAUSE ITS A READ ONLY DATA ==========================================>
    const tokenData = { ...userData.pushTokens } || {};
    const tokenArray = Object.values(tokenData);

    if (tokenArray.includes(newToken)) {
      return;
    }
    tokenArray.push(newToken);

    for (let i = 0; i < tokenArray.length; i++) {
      let tok = tokenArray[i];
      tokenData[i] = tok;
    }

    const userRef = child(dbRef, `UserData/${userData.uid}/pushTokens`);
    await set(userRef, tokenData);

  } catch (error) {
    console.log(error);
  }
};

export const removePushToken = async (userData) => {
  try {
    if (!Device.isDevice) {
      return;
    }
    const tokenData =await getUserPushTokens(userData.uid);
    // console.log(tokenData)
    const tokenArray = Object.values(tokenData);

    const token = (await Notifications.getExpoPushTokenAsync({
      projectId: "31e16bb3-9f3b-4ccf-9d06-d97345783a30",
    })).data;
  
    let newTokenData = {};
    for (let i = 0; i < tokenArray.length; i++) {
      if (tokenArray[i] !== token) {
        newTokenData[i] = tokenArray[i];
      }
    }
    // console.log(newTokenData);
    const userRef = child(dbRef, `UserData/${userData.uid}/pushTokens`);
    await set(userRef, newTokenData);
  } catch (error) {
    console.log(error);
  }
};

export const getUserPushTokens = async(userId) => {
  const tokenRef = child(dbRef, `UserData/${userId}/pushTokens`);
  const snapshot =await get(tokenRef);
  
  if (!snapshot || !snapshot.exists()) {
    return {};
  }
  return snapshot.val() || {};
};
