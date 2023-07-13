import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {app} from "../firebase/FirebaseConfig";
import { child, getDatabase, ref, set } from "firebase/database";
import { registerForPushNotificationsAsync } from '../navigations/MainNavigator';

const dbRef = ref(getDatabase(app))

export const savePushToken = async(userData) => {
   try {
      const newToken =(await Notifications.getExpoPushTokenAsync({
        projectId: '31e16bb3-9f3b-4ccf-9d06-d97345783a30',
      })).data
      const tokenData = userData.pushTokens || {}
      const tokenArray = Object.values(tokenData);
      console.log(tokenData)

      if(tokenArray.includes(newToken)){
        return;
      }
      tokenArray.push(newToken);
      console.log(tokenArray)

      let newTokenData = {};
      for(let i =0;i<tokenArray.length;i++){
        let tok= tokenArray[i]
         newTokenData[i]=tok
      }
      console.log(newTokenData)
      
      const userRef = child(dbRef,`UserData/${userData.uid}/pushTokens`);
      await set(userRef,newTokenData);
   
   } catch (error) {
     console.log(error)
   }
}