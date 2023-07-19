import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

const NoInternetScreen = ({props}) => {
    // console.log(props)
  return (
    <View style={styles.container}>
      <Text style={{...styles.text,fontSize:40}}>SORRY !</Text>
        <Entypo name="emoji-sad" size={150} color="#6f4e37" />
      <Text style={styles.text}>YOU ARE NOT CONNECTED TO INTERNET</Text>
      <MaterialCommunityIcons
        name="wifi-off"
        size={70}
        color="#6F4E37"
        style={{ paddingBottom: 20 }}
      />
      <TouchableOpacity onPress={()=>props()}>
        <Text style={styles.buttonText}>
            RETRY
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NoInternetScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#6f4e37",
    fontSize: 20,
    fontFamily: "Bold",
    textAlign: "center",
    paddingVertical:10,
  },
  buttonText:{
    color:"#fff",
    fontSize:20,
    fontFamily:"Medium",
    letterSpacing:3,
    // textAlign:"center",
    backgroundColor:'#2196F3',
    paddingHorizontal:40,
    paddingVertical:2,
    borderRadius:10,
  }
});
