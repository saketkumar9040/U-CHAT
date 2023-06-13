import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync()
NavigationBar.setBackgroundColorAsync("#6F4E37");

export default function App() {

  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(()=>{
    setTimeout(()=>{
        setAppLoaded(true);
    },2000)
  },[]);

  const onLayout = useCallback(async()=>{
    if(appLoaded){
     await SplashScreen.hideAsync();
    }
  },[appLoaded]);

  if(!appLoaded){
    return null;
  }

  return (
    <SafeAreaProvider style={styles.container} onLayout={onLayout}>
      <SafeAreaView>
        <StatusBar style="light" backgroundColor="#6F4E37" barStyle="light-content"/>
        <Text>Hello U-Chat</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
    alignItems: 'center',
    justifyContent: 'center',
  },
});
