import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import "react-native-gesture-handler";
import AppNavigator from "./navigations/AppNavigator";
import { Provider } from "react-redux";
import { store } from "./store/Store";




SplashScreen.preventAutoHideAsync();




export default function App() {

  NavigationBar.setBackgroundColorAsync("#6F4E37");
  
  const [appLoaded, setAppLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          Black: require("./assets/fonts/Kanit-Black.ttf"),
          BlackItalic: require("./assets/fonts/Kanit-BlackItalic.ttf"),
          Bold: require("./assets/fonts/Kanit-Bold.ttf"),
          BoldItalic: require("./assets/fonts/Kanit-BoldItalic.ttf"),
          ExtraBold: require("./assets/fonts/Kanit-ExtraBold.ttf"),
          ExtraBoldItalic: require("./assets/fonts/Kanit-ExtraBoldItalic.ttf"),
          ExtraLight: require("./assets/fonts/Kanit-ExtraLight.ttf"),
          ExtraLightItalic: require("./assets/fonts/Kanit-ExtraLightItalic.ttf"),
          Italic: require("./assets/fonts/Kanit-Italic.ttf"),
          Light: require("./assets/fonts/Kanit-Light.ttf"),
          lightItalic: require("./assets/fonts/Kanit-LightItalic.ttf"),
          Medium: require("./assets/fonts/Kanit-Medium.ttf"),
          MediumItalic: require("./assets/fonts/Kanit-MediumItalic.ttf"),
          Regular: require("./assets/fonts/Kanit-Regular.ttf"),
          SemiBold: require("./assets/fonts/Kanit-SemiBold.ttf"),
          SemiBoldItalic: require("./assets/fonts/Kanit-SemiBoldItalic.ttf"),
          Thin: require("./assets/fonts/Kanit-Thin.ttf"),
          ThinItalic: require("./assets/fonts/Kanit-ThinItalic.ttf"),
        });
      } catch (error) {
        console.log(error);
      } finally {
        setAppLoaded(true);
      }
    };
    loadFonts();
  }, []);

  const onLayout = useCallback(async () => {
    if (appLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appLoaded]);

  if (!appLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
    <SafeAreaProvider style={styles.container} onLayout={onLayout}>
      <StatusBar style="light" backgroundColor="#6F4E37" />
        <AppNavigator/>
    </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
  },
});
