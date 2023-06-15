import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import backgroundImage from "../assets/images/authBackground.jpg";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

const SignInScreen = ({navigation}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // console.log(name)
  // console.log(email)
  // console.log(phone)
  // console.log(address)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signInTextContainer}>
        <Text style={styles.signInText}>Sign In</Text>
      </View>
      <ImageBackground
        source={backgroundImage}
        style={styles.ImageBackgroundContainer}
        opacity={0.6}
      >
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={25} color="#fff" />
          <TextInput
            placeholder="Enter E-mail"
            placeholderTextColor="#6f4e37"
            style={styles.textInput}
            selectionColor="#6f4e37"
            // onChangeText={(e)=>setEmail(e.target.value)}
            keyboardType="email-address"
          />
        </View>
        {showPassword === false ? (
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowPassword(true)}>
              <Feather name="lock" size={25} color="#fff" />
            </TouchableOpacity>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#6f4e37"
              style={styles.textInput}
              selectionColor="#6f4e37"
              secureTextEntry={true}
              // onChangeText={(e)=>setAddress(e.target.value)}
            />
          </View>
        ) : (
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowPassword(false)}>
              <Feather name="unlock" size={25} color="#fff" />
            </TouchableOpacity>
            <TextInput
              placeholder="Enter Password"
              placeholderTextColor="#6f4e37"
              style={styles.textInput}
              selectionColor="#6f4e37"
              // onChangeText={(e)=>setAddress(e.target.value)}
            />
          </View>
        )}
        <TouchableOpacity style={styles.buttonContainer}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
         <Text style={{...styles.signUpText,fontSize:19,marginVertical:20,alignSelf:"center",letterSpacing:3,backgroundColor:"transparent",}} >new to U-CHAT ?</Text>
        <TouchableOpacity style={styles.signUpButton} onPress={()=>navigation.navigate("SignUpScreen")}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageBackgroundContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  signInTextContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6f4e37",
  },
  signInText: {
    fontSize: 35,
    color: "#fff",
    alignContent: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6f4e37",
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingLeft: 15,
    borderRadius: 50,
  },
  textInput: {
    width: "90%",
    color: "#6f4e37",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 18,
    backgroundColor: "#fff",
    height: 40,
    marginLeft: 10,
    //  fontFamily: "Medium",
  },
  buttonContainer: {
    marginTop: 20,
    padding:15,
    alignSelf: "center",
    backgroundColor:"#6f4e37",
    borderRadius:40,
  },
  buttonText:{
   color:"#fff",
   fontSize:20,
   // fontWeight:500,
   letterSpacing:1,
   marginHorizontal:40,
  },
  signUpText:{
   color:"#6f4e37",
   fontSize:28,
  //  padding:5,
   paddingHorizontal:20,
  },
  signUpButton:{
   borderWidth:6,
   borderRadius:35,
   borderColor:"#6f4e37"
  }
});
