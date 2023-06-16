import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ImageBackground } from "react-native";
import backgroundImage from "../assets/images/authBackground.jpg";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  nameVaildator,
  emailValidator,
  passwordValidator,
  numberValidator,
} from "../utils/Validators";

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = () => {
    if(nameVaildator(name) !== undefined){
      return alert(nameVaildator(name).name)
    };
    if(emailValidator(email) !== undefined){
      return alert(emailValidator(email).email)
    };
    if(numberValidator(number) !== undefined){
      return alert(numberValidator(number).number)
    };
    if(passwordValidator(password) !== undefined){
      return alert(passwordValidator(password).password)
    };


    alert("SignUp Successfully,Please sign in to continue");
    setName("")
    setEmail("");
    setNumber("");
    setPassword("");
    navigation.navigate("SignInScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signInTextContainer}>
        <Text style={styles.signInText}>Sign Up</Text>
      </View>
      <ImageBackground
        source={backgroundImage}
        style={styles.ImageBackgroundContainer}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.inputContainer}>
            <Feather name="user" size={25} color="#fff" />
            <TextInput
              placeholder="Enter Name"
              placeholderTextColor="#6f4e37"
              autoCapitalize="none"
              style={styles.textInput}
              selectionColor="#6f4e37"
              value={name}
              onChangeText={(e) => setName(e)}
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={25}
              color="#fff"
            />
            <TextInput
              placeholder="Enter E-mail"
              placeholderTextColor="#6f4e37"
              autoCapitalize="none"
              style={styles.textInput}
              selectionColor="#6f4e37"
              value={email}
              onChangeText={(e) => setEmail(e)}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="email-outline"
              size={25}
              color="#fff"
            />
            <TextInput
              placeholder="Enter Number"
              placeholderTextColor="#6f4e37"
              style={styles.textInput}
              selectionColor="#6f4e37"
              value={number}
              onChangeText={(e) =>
                e.length > 10
                  ? alert("Number must be 10 digits ") 
                  : setNumber(e)
              }
              keyboardType="numeric"
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
                autoCapitalize="none"
                style={styles.textInput}
                selectionColor="#6f4e37"
                value={password}
                secureTextEntry={true}
                onChangeText={(e) => setPassword(e)}
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
                autoCapitalize="none"
                style={styles.textInput}
                selectionColor="#6f4e37"
                value={password}
                onChangeText={(e) => setPassword(e)}
              />
            </View>
          )}
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={submitHandler}
          >
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
          <Text
            style={{
              ...styles.signUpText,
              fontSize: 19,
              marginVertical: 20,
              alignSelf: "center",
            }}
          >
            Already have an account ?
          </Text>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("SignInScreen")}
          >
            <Text style={styles.signUpText}>Sign In</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  ImageBackgroundContainer: {
    flex: 1,
    alignItems: "center",
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
    fontWeight: 700,
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
    padding: 15,
    alignSelf: "center",
    backgroundColor: "#6f4e37",
    borderRadius: 40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    // fontWeight:500,
    letterSpacing: 1,
    marginHorizontal: 40,
  },
  signUpText: {
    color: "#6f4e37",
    fontSize: 28,
    //  padding:5,
    paddingHorizontal: 20,
    backgroundColor: "#FEFF75",
    borderRadius: 35,
  },
  signUpButton: {
    borderWidth: 3,
    borderRadius: 35,
    borderColor: "#6f4e37",
    alignSelf: "center",
    backgroundColor: "#FEFF75",
  },
});
