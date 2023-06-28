import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  Feather,
  MaterialCommunityIcons,
  Octicons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import { TextInput } from "react-native";
import {
  nameVaildator,
  emailValidator,
  numberValidator,
} from "../utils/Validators";
import { useDispatch, useSelector } from "react-redux";
import { child, getDatabase, ref, update } from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { autoLogout, updateUserData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage";

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  // console.log(userData)

  const [name, setName] = useState(userData?.name ? userData.name : "");
  const [email, setEmail] = useState(userData?.email ? userData.email : "");
  const [number, setNumber] = useState(userData.number ? userData.number : "");
  const [about, setAbout] = useState(userData.about ? userData.about : "");

  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const submitHandler = async () => {
    if (nameVaildator(name) !== undefined) {
      return alert(nameVaildator(name).name);
    }
    if (emailValidator(email) !== undefined) {
      return alert(emailValidator(email).email);
    }
    if (numberValidator(number) !== undefined) {
      return alert(numberValidator(number).number);
    }
    let updatedUserDate = {
      name: name,
      email: email,
      number: number,
      about: about,
    };
    try {
      setIsLoading(true);
      //  UPDATE USER IN FIRESTOR REALTIME - DATABASE =====================>
      const dbRef = ref(getDatabase());
      const childRef = child(dbRef, `UserData/${userData.uid}`);
      await update(childRef, updatedUserDate);
      Alert.alert("Profile Updated Successfully 😊");

      setIsLoading(false);
      setHasChanges(false);
      dispatch(updateUserData({ updatedUserDate }));
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const logoutHandler = () => {
    AsyncStorage.clear();
    dispatch(autoLogout());
    console.log("logOut successfully 😏");
    Alert.alert("Logout Successfully 😏");
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
              <AntDesign name="arrowleft" size={25} color="#fff" />
            </TouchableOpacity>
              <Ionicons name="settings" size={30} style={{marginLeft:20,color:"#fff"}} />
            <Text style={{marginLeft:5,fontSize:32,fontFamily:"Bold",color:"#fff"}}>
              Settings
            </Text>
          </View>
        );
      },
    });
  }, [userData]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ marginBottom: 50 }}
      >
        <ProfileImage userData={userData} />
        <View style={styles.inputContainer}>
          <Feather name="user" size={25} color="#fff" />
          <TextInput
            placeholder="Enter Name"
            placeholderTextColor="#6f4e37"
            autoCapitalize="none"
            style={styles.textInput}
            selectionColor="#6f4e37"
            value={name}
            onChangeText={(e) => {
              setHasChanges(true);
              setName(e);
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={25} color="#fff" />
          {/* <TextInput
            placeholder="Enter E-mail"
            placeholderTextColor="#6f4e37"
            autoCapitalize="none"
            style={styles.textInput}
            selectionColor="#6f4e37"
            value={email}
            onChangeText={(e) => {
              setHasChanges(true)
              setEmail(e)}}
            keyboardType="email-address"
          /> */}
          <Text
            style={{
              ...styles.textInput,
              color: "#fff",
              backgroundColor: "#6f4e37",
            }}
          >
            {email}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Feather name="phone" size={24} color="#fff" />
          {/* <TextInput
            placeholder="Enter Number"
            placeholderTextColor="#000"
            style={styles.textInput}
            selectionColor="#000"
            value={number}
            onChangeText={(e) =>
              e.length <= 10 ? setNumber(e) : alert("Number must be 10 digits ")
            }
            keyboardType="numeric"
          /> */}
          <Text
            style={{
              ...styles.textInput,
              color: "#fff",
              backgroundColor: "#6f4e37",
            }}
          >
            {number}
          </Text>
        </View>
        <View style={{ ...styles.inputContainer, flex: 1 }}>
          <Octicons name="info" size={24} color="#fff" />
          <TextInput
            placeholder="Describe yourself"
            placeholderTextColor="#6f4e37"
            autoCapitalize="none"
            style={{ ...styles.textInput, flex: 1 }}
            selectionColor="#6f4e37"
            value={about}
            onChangeText={(e) => {
              setHasChanges(true);
              e.length <= 150
                ? setAbout(e)
                : alert("Description must be less than 150 characters ");
            }}
            multiline={true}
          />
        </View>
      </ScrollView>
      <View style={styles.mainButtonContainer}>
        {isLoading ? (
          <View style={styles.buttonContainer}>
            <ActivityIndicator size={30} color="#fff" />
          </View>
        ) : (
          <TouchableOpacity
            style={
              hasChanges
                ? styles.buttonContainer
                : { ...styles.buttonContainer, backgroundColor: "grey" }
            }
            onPress={submitHandler}
            disabled={!hasChanges}
          >
            <Text style={styles.buttonText}>SAVE</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={{ ...styles.buttonContainer, backgroundColor: "red" }}
          onPress={logoutHandler}
        >
          <Text style={styles.buttonText}>LOGOUT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
    padding: 5,
    alignItems: "center",
  },
  headerContainer: {
    flexDirection:"row",
    alignItems:"center",
    paddingLeft: 8,
    fontSize: 35,
    letterSpacing: 3,
    fontFamily: "BoldItalic",
    color: "#6f4e37",
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6f4e37",
    marginVertical: 10,
    marginHorizontal: 20,
    paddingHorizontal: 15,
    paddingLeft: 15,
    borderRadius: 10,
  },
  textInput: {
    width: "90%",
    color: "#000",
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginVertical: 10,
    fontSize: 20,
    backgroundColor: "#fff",
    marginLeft: 10,
    fontFamily: "BoldItalic",
  },
  buttonContainer: {
    width: "45%",
    // height: 50,
    // marginTop: 20,
    padding: 10,
    alignSelf: "center",
    backgroundColor: "green",
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    alignSelf: "center",
    fontWeight: 900,
    letterSpacing: 2,
  },
  mainButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "absolute",
    bottom: 5,
  },
});
