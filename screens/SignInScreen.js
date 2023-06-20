import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import backgroundImage from "../assets/images/authBackground.jpg";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { emailValidator, passwordValidator } from "../utils/Validators";
import { signInWithEmailAndPassword } from "firebase/auth";
import { app, auth } from "../firebase/FirebaseConfig";
import { useDispatch } from "react-redux";
import { authenticate, autoLogout } from "../store/Slice";
import { Alert } from "react-native";
import { child, get, getDatabase, ref } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";

let timer;

const SignInScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = async () => {
    if (emailValidator(email) !== undefined) {
      return alert(emailValidator(email).email);
    }
    if (passwordValidator(password) !== undefined) {
      return alert(passwordValidator(password).password);
    }

    setIsLoading(true);
    try {
      //  SIGN IN WITH FIREBASE ACCOUNT ================================>
      const signIn = await signInWithEmailAndPassword(auth, email, password);
      const { uid, stsTokenManager } = signIn.user;
      const { accessToken, expirationTime } = stsTokenManager;

      //  GETTING USER DATA FROM FIREBASE ===============================>

      const dbRef = ref(getDatabase(app));
      const userRef = child(dbRef, `UserData/${uid}`);
      const snapshot = await get(userRef);
      let userData = snapshot.val();

      //  SENDING DATA TO STORE  ======================================>
      dispatch(authenticate({ token: accessToken, userData }));

      //  STORING USER DATA TO LOCAL STORAGE ================================>
      AsyncStorage.setItem(
        "userData",
        JSON.stringify({
          accessToken,
          uid,
          expiryDate: new Date(expirationTime).toISOString(),
        })
      );

      //  AUTO LOG OUT IF TOKEN EXPIRES =======================================>
      let expiryDate = new Date(expirationTime);
      let milisecondsToExpiry = expiryDate - new Date();
       setTimeout(async() => {
         AsyncStorage.clear();
         clearTimeout(timer);
         await dispatch(autoLogout());
         Alert.alert("session Expired 😐","please sign in again")
      }, milisecondsToExpiry);

      Alert.alert("Signin Successfully 🙂");
      setEmail("");
      setPassword("");
    } catch (error) {
      setIsLoading(false);
      if (error.code === "auth/user-not-found") {
        return Alert.alert("Error", "No Such user Exists 🙁");
      }
      if (error.code === "auth/wrong-password") {
        return Alert.alert("Error", "Password Incorrect,please try again 🙁");
      }
      console.log(error);
      console.log(error.code);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.signInTextContainer}>
        <Text style={styles.signInText}>Sign In</Text>
      </View>
      <ImageBackground
        source={backgroundImage}
        style={styles.ImageBackgroundContainer}
      >
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={25} color="#fff" />
          <TextInput
            placeholder="Enter E-mail"
            placeholderTextColor="#000"
            autoCapitalize="none"
            style={styles.textInput}
            selectionColor="#000"
            value={email}
            onChangeText={(e) => setEmail(e)}
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
              placeholderTextColor="#000"
              autoCapitalize="none"
              style={styles.textInput}
              selectionColor="#000"
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
              placeholderTextColor="#000"
              autoCapitalize="none"
              style={styles.textInput}
              selectionColor="#000"
              value={password}
              onChangeText={(e) => setPassword(e)}
            />
          </View>
        )}
        {isLoading ? (
          <View style={styles.buttonContainer}>
            <ActivityIndicator size={30} color="#fff" />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={submitHandler}
          >
            <Text style={styles.buttonText}>SUBMIT</Text>
          </TouchableOpacity>
        )}
        <Text
          style={{
            ...styles.signUpText,
            fontSize: 19,
            marginTop: 20,
            alignSelf: "center",
            backgroundColor: "#FEFF75",
            padding: 20,
            borderRadius: 30,
          }}
        >
          new to U-CHAT ?
        </Text>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("SignUpScreen")}
        >
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
    backgroundColor: "#6f4e37",
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
    fontFamily:"ExtraBoldItalic",
    letterSpacing:3,
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
    color: "#000",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 20,
    backgroundColor: "#fff",
    height: 40,
    marginLeft: 10,
    fontFamily: "BoldItalic",
  },
  buttonContainer: {
    width: "50%",
    height: 60,
    marginTop: 20,
    padding: 15,
    alignSelf: "center",
    backgroundColor: "#6f4e37",
    borderRadius: 40,
    elevation:10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    alignSelf: "center",
    fontWeight:800,
    letterSpacing: 3,
  },
  signUpText: {
    color: "#6f4e37",
    fontSize: 25,
     padding:5,
    paddingHorizontal: 20,
    fontWeight:700,
  },
  signUpButton: {
    borderWidth: 3,
    borderRadius: 35,
    borderColor: "#6f4e37",
    backgroundColor: "#FEFF75",
    elevation:10,
  },
});
