import { StyleSheet, Text, TextInput, View, Image } from "react-native";
import React, { useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton.js";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { FontAwesome, Entypo, Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
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
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setStoredUsers } from "../store/userSlice.js";

const NewChatScreen = ({ navigation, route }) => {
  const isGroupChat = route?.params?.isGroupChat;
  // console.log(isGroupChat)

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState("");
  const [searchText, setSearchText] = useState("");
  // const [placeholderText, setPlaceholderText] = useState("Search");
  const [noUserFound, setNoUserFound] = useState(false);
  // console.log(users);
  const [groupName, setGroupName] = useState("");
  // console.log(groupName)
  const [ selectedUser,setSelectedUser] = useState([]);
  console.log(selectedUser);

  let loginUserData = useSelector((state) => state.auth.userData);
  // console.log(loginUserData.uid);

  const dispatch = useDispatch();

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
            <Text
              style={{ fontSize: 20, fontFamily: "BoldItalic", color: "#fff" }}
            >
              {isGroupChat ? "ADD PARTICIPANTS" : "SEARCH "}
            </Text>
          </HeaderButtons>
        );
      },
      headerTitle: "",
      headerRight: () => {
        return (
          <View>
            {isGroupChat && (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingRight: 15,
                }}
                onPress={() => {}}
              >
                {groupName !== "" && selectedUser.length !==0 && (
                  <>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: "Medium",
                        color: "#fff",
                        marginRight: 2,
                      }}
                    >
                      Create
                    </Text>
                    <Ionicons name="save" size={24} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        );
      },
    });
  }, [groupName,selectedUser.length]);

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (!searchText || searchText === "") {
        setUsers();
        setNoUserFound(false);
        return;
      }
      setIsLoading(true);
      try {
        const searchQuery = searchText.toLowerCase().trim();
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
          const searchResult = snapshot.val();
          // console.log(searchResult);
          if (searchResult[loginUserData?.uid]) {
            await delete searchResult[loginUserData?.uid]; //  DELETE LOGGED-IN USER FROM SEARCH RESULT  //
          }
          await setUsers(searchResult);

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

  // useEffect(() => {
  //   const placeHolderText = async () => {
  //     let names = ["Friends😎", "Family👪", "Groups👩‍👩‍👧‍👦"];
  //     let count = 0;

  //     const cycleArray = async () => {
  //       let name = names[count];
  //       // console.log(name);
  //       setTimeout(async () => {
  //         await setPlaceholderText(name);
  //       }, 3000);
  //       // increment our counter
  //       count++;

  //       // reset counter if we reach end of array
  //       if (count === names.length) {
  //         count = 0;
  //       }
  //     };
  //     setInterval(cycleArray, 5000);
  //   };
  //   placeHolderText();
  // }, []);

  // const userPressed = async (userData) => {
  //   // console.log(userData)
  //   await dispatch(setStoredUsers({ newUsers: { userData } }));
  //   navigation.navigate("ChatList", {
  //     selectedUser: userData,
  //   });
  // };

  return (
    <SafeAreaView style={styles.container}>
      {isGroupChat && (
        <View style={styles.groupNameContainer}>
          <Text style={styles.groupText}>GROUP NAME</Text>
          <TextInput
            placeholder="Enter group name"
            placeholderTextColor="#808080"
            style={styles.groupTextInput}
            value={groupName}
            onChangeText={(e) =>
              setGroupName(e)
            }
            autoCapitalize="none"
          />
        </View>
      )}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={28} color="#fff" />
        <TextInput
          placeholder={
            isGroupChat
              ? "Search Participants👩‍👩‍👧‍👦"
              : "Family👪,Friends😎,Groups👩‍👩‍👧‍👦"
          }
          placeholderTextColor="#808080"
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
              // console.log(userData.uid)
              return (
                <TouchableOpacity
                  style={styles.searchResultContainer}
                  onPress={isGroupChat ? (()=>{
                    const newSelectedUser = selectedUser.includes(userData.uid) ?
                    selectedUser.filter(id=>id!=userData.uid):
                    selectedUser.concat(userData.uid)
                    setSelectedUser(newSelectedUser)
                    //  setUserPressed(!userPressed)
                    //  console.log("user Selected")
                  }
                  ):(
                    async () => {
                      navigation.navigate("ChatList", {
                        selectedUser: userData,
                      });
                      await dispatch(setStoredUsers({ newUsers: { userData } }));
                    }
                  )
                }
                >
                  <Image
                    source={{ uri: userData.ProfilePicURL }}
                    style={styles.searchUserImage}
                    resizeMode="contain"
                  />
                  <View style={styles.searchUserTextContainer}>
                    <Text style={styles.searchUserName}>
                      {userData.name.toUpperCase()}
                    </Text>
                    <Text style={styles.searchUserTapToChat}>{isGroupChat?"Press to select/unselect":"Tap to chat"}</Text>
                  </View>
              {   
                 isGroupChat ? (
                  <MaterialIcons name={selectedUser.includes(userData.uid)?"check-box":"check-box-outline-blank"} size={35} color="#6f4e37"  style={styles.searchUserArrow} />
                 ):(
                   <AntDesign
                      name="forward"
                      size={20}
                      color="#6f4e37"
                      style={styles.searchUserArrow}
                    />
                 )
                }
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
    margin: 5,
  },
  textInput: {
    width: "85%",
    color: "#000",
    borderRadius: 25,
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 18,
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
  searchResultContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 80,
    // backgroundColor: "#6f4e37",
    borderWidth: 3,
    borderColor: "#6f4e37",
    borderRadius: 50,
    paddingHorizontal: 10,
    margin: 5,
    marginHorizontal: 20,
  },
  searchUserImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#6f4e37",
    backgroundColor: "#6f4e37",
    marginRight: 5,
  },
  searchUserTextContainer: {
    flexDirection: "column",
    marginLeft: 10,
  },
  searchUserTapToChat: {
    fontSize: 13,
    color: "#6f4e37",
    fontFamily: "Bold",
  },
  searchUserName: {
    fontSize: 22,
    color: "#6f4e37",
    fontFamily: "BoldItalic",
  },
  searchUserArrow: {
    position: "absolute",
    right: 20,
  },
  groupNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-evenly",
    backgroundColor: "#6f4e37",
    // borderRadius: 40,
    marginVertical: 1,
    paddingHorizontal: 15,
  },
  groupText: {
    fontSize: 17,
    fontFamily: "Medium",
    color: "#fff",
    marginRight: 10,
  },
  groupTextInput: {
    flex: 1,
    color: "#000",
    paddingHorizontal: 20,
    marginVertical: 10,
    fontSize: 18,
    backgroundColor: "#fff",
    height: 40,
    fontFamily: "MediumItalic",
  },
});
