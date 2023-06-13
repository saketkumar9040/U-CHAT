import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatListScreen from "./screens/ChatListScreen";
import ChatSettingScreen from "./screens/ChatSettingScreen";
import SettingsScreen from "./screens/SettingsScreen";
import { Ionicons, Fontisto } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  NavigationBar.setBackgroundColorAsync("#6F4E37");
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        tabBarStyle: {
          backgroundColor: "#6F4E37",

        },
      }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chat",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="player-settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
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
    <SafeAreaProvider style={styles.container} onLayout={onLayout}>
      <StatusBar style="light" backgroundColor="#6F4E37" />
      <NavigationContainer style={{backgroundColor:"#6F4E37"}} >
        <Stack.Navigator 
           screenOptions={{
              // tabBarStyle: {
              //   backgroundColor: "#6F4E37",
      
              // },
              contentStyle:{
                backgroundColor: "#6F4E37",
              },
           }}  
           >
          <Stack.Screen
            name="Home"
            component={TabNavigator}
            options={{ headerShown: false }}
            
          />
          <Stack.Screen
            name="ChatSettingScreen"
            component={ChatSettingScreen}
            options={{
              gestureEnabled: true,
              headerTitle: "Settings",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
  },
});
