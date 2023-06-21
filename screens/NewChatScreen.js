import { StyleSheet, Text, TextInput, View,Image } from "react-native";
import React, { useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton.js";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SearchBar } from "react-native-screens";
import {
  child,
  endAt,
  get,
  getDatabase,
  orderByChild,
  query,
  ref,
  startAt,
} from "firebase/database";
import { db } from "../firebase/FirebaseConfig.js";
import { ActivityIndicator } from "react-native";
import { FlatList } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from "react-native";

const NewChatScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [searchText, setSearchText] = useState("");
  const [noUserFound, setNoUserFound] = useState(false);
  // console.log(users);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="newChat"
              iconName="ios-close-sharp"
              color="#fff"
              onPress={() => {
                navigation.goBack();
              }}
              style={{ paddingHorizontal: 10 }}
            />
          </HeaderButtons>
        );
      },
      headerTitle: "NEW CHAT",
    });
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchText || searchText === "") {
        setUsers();
        setNoUserFound(false);
        return;
      }
      setIsLoading(true);
      try {
        const searchQuery = searchText.toLowerCase();
        const dbRef = ref(getDatabase());
        const userRef = child(dbRef, "UserData");

        const queryRef = query(
          userRef,
          orderByChild("searchName"),
          startAt(searchQuery),
          endAt(searchQuery + "\uf8ff")
        );
        const snapshot = await get(queryRef);
        setIsLoading(false);
        if (snapshot.exists()) {
          setUsers(snapshot.val());
          setNoUserFound(false);
          return;
        } else {
          setUsers({});
          setNoUserFound(true);
        }
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={28} color="#fff" />
        <TextInput
          placeholder={"       >>>  Search here 🧐  <<< "}
          placeholderTextColor="#000"
          selectionColor="#000"
          style={styles.textInput}
          onChangeText={(e) => {
            setSearchText(e);
          }}
          autoCapitalize="none"
        />
      </View>
      {
        //  WHILE SEARCHING USER
        isLoading && (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size={100} color="#6f4e37" />
          </View>
        )
      }
      {
        // SHOWING USER FLATLIST
        !isLoading && !noUserFound && users && (
          <FlatList
            data={Object.keys(users)}
            renderItem={(itemData) => {
              const userId = itemData.item;
              const userData = users[userId];
              return (
                <TouchableOpacity style={styles.searchResultContainer}>
                  <Image source={{uri:userData.ProfilePicURL}} style={styles.searchUserImage} resizeMode="contain"/>
                 <View style={styles.searchUserTextContainer}>
                 <Text style={styles.searchUserName}>{userData.name.toUpperCase()}</Text>
                  <Text style={styles.searchUserTapToChat}>Tap to chat</Text>
                 </View>
                  <AntDesign name="forward" size={20} color="#6f4e37" style={styles.searchUserArrow}/>
                </TouchableOpacity>
              );
            }}
          />
        )
      }
      {
        //  NO USER FOUND
        !isLoading && noUserFound && (
          <View style={styles.userContainer}>
            <Entypo name="emoji-sad" size={130} color="#6f4e37" />
            <Text style={styles.noUserText}>No user found</Text>
          </View>
        )
      }
      {
        //  WHEN SEARCH QUERY IS EMPTY
        !isLoading && !users && (
          <View style={styles.userContainer}>
            <FontAwesome name="users" size={150} color="#6f4e37" />
            <Text style={styles.noUserText}>Enter a name to search user</Text>
          </View>
        )
      }
    </SafeAreaView>
  );
};

export default NewChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffbf00",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#6f4e37",
    borderRadius: 40,
    // paddingHorizontal: 5,
    margin: 5,
  },
  textInput: {
    width: "85%",
    color: "#000",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 20,
    backgroundColor: "#fff",
    height: 40,
    fontFamily: "BoldItalic",
  },
  userContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noUserText: {
    fontSize: 22,
    paddingTop: 10,
    color: "#6f4e37",
    fontFamily: "Bold",
  },
  searchResultContainer:{
    flexDirection: "row",
    alignItems: "center",
    height:80,
    // backgroundColor: "#6f4e37",
    borderWidth:3,
    borderColor:"#6f4e37",
    borderRadius: 50,
    paddingHorizontal: 10,
    margin: 5,
    marginHorizontal:20,
  },
  searchUserImage:{
     width:60,
     height:60,
     borderRadius:40,
     borderWidth:3,
     borderColor:"#6f4e37",
     backgroundColor:"#6f4e37",
     marginRight:5,
  },
  searchUserTextContainer:{
    flexDirection:"column",
    marginLeft:10,
  
  },
  searchUserTapToChat:{
    fontSize:13,
    color: "#6f4e37",
    fontFamily: "Bold",
  },
  searchUserName:{
    fontSize: 20,
    color: "#6f4e37",
    fontFamily: "BoldItalic",
  },
  searchUserArrow:{
    position:"absolute",
    right:20,
  },
});
