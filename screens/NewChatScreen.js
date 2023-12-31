import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton.js";
import {
  FontAwesome,
  Entypo,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import {
  child,
  endAt,
  get,
  getDatabase,
  onValue,
  orderByChild,
  push,
  query,
  ref,
  startAt,
  update,
} from "firebase/database";
import { app } from "../firebase/FirebaseConfig.js";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setStoredUsers } from "../store/userSlice.js";
import userPic from "../assets/images/userProfile.png";
import { launchImagePicker, uploadImage } from "../utils/ImagePickerHelper.js";
import { SaveNewChat, sendMessage } from "../utils/ChatHandler.js";
import { updateChatData } from "../store/chatSlice.js";

const NewChatScreen = ({ navigation, route }) => {
  const isGroupChat = route?.params?.isGroupChat;
  // console.log(isGroupChat)
  const chatId = route?.params?.chatId;
  // console.log(chatId)

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tempUri, setTempUri] = useState("");
  const [users, setUsers] = useState();
  // console.log(users)
  const [searchText, setSearchText] = useState("");
  // const [placeholderText, setPlaceholderText] = useState("Search");
  const [noUserFound, setNoUserFound] = useState(false);
  // console.log(users);
  const [groupName, setGroupName] = useState("");
  // console.log(groupName)
  const [selectedUser, setSelectedUser] = useState([]);
  // console.log(selectedUser.length);

  let loginUserData = useSelector((state) => state.auth.userData);
  // console.log(loginUserData.uid);

  let storedUser = useSelector((state) => state.users.storedUser);
  // console.log(storedUser)

  let chatData =
    chatId && useSelector((state) => state.chats.chatsData[chatId]);
  // console.log(chatData)

  const dispatch = useDispatch();

  const flatlistRef = useRef();

  const dbRef = ref(getDatabase(app));

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
                navigation.navigate("ChatList");
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
            {isGroupChat && !chatId ? (
              <>
                {isSaving ? (
                  <ActivityIndicator
                    size={30}
                    color="#fff"
                    style={{ marginRight: 20 }}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingRight: 15,
                    }}
                    onPress={() => saveGroupHandler()}
                  >
                    <Ionicons name="save" size={30} color="#fff" />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <>
                {isGroupChat && isSaving ? (
                  <ActivityIndicator
                    size={30}
                    color="#fff"
                    style={{ marginRight: 20 }}
                  />
                ) : (
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingRight: 15,
                    }}
                    onPress={() => addParticipants()}
                  >
                    <Text style={styles.groupText}>ADD</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        );
      },
    });
  }, [groupName, isSaving, selectedUser]);

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
          setUsers();
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

  const saveGroupHandler = async () => {
    try {
      if (!selectedUser || (selectedUser?.length < 1 && groupName === "")) {
        Alert.alert("Please Enter a Group Name and select group members");
        return;
      }
      if (!selectedUser && selectedUser?.length < 1) {
        Alert.alert("Please select Group memebers");
        return;
      }
      if (groupName === "") {
        Alert.alert("Please Enter a group name");
        return;
      }
      if(tempUri ===""){   
        Alert.alert("Please select a profile pic");
        return;    
      }
      setIsSaving(true);
      const usersId = selectedUser.map((e) => e.uid);
      usersId.push(loginUserData.uid);
      // console.log(usersId)

      let uploadedImage = await uploadImage(tempUri);
      let chatId = await SaveNewChat(
        loginUserData.uid,
        usersId,
        groupName,
        uploadedImage.URL,
        uploadedImage.imageName
      );
      const chatRef = child(dbRef, `Chats/${chatId}`);
      await onValue(chatRef, async (snapshot) => {
        let chatsData = {};
        const data = snapshot.val();
        data.key = chatId;
        chatsData[chatId] = data;
        await dispatch(updateChatData({ chatsData }));
        await dispatch(setStoredUsers({ newUsers: { selectedUser } }));
        setIsSaving(false);
        setSelectedUser([]);
        setGroupName("");
        navigation.navigate("ChatList");
      });
      // Alert.alert("Group chat created successfully😄");
    } catch (error) {
      setIsSaving(false);
      Alert.alert("Unable to create group chat😌");
      console.log(error);
    }
  };

  const imageHandler = async () => {
    const uri = await launchImagePicker();
    setTempUri(uri);
  };

  const addParticipants = async () => {
    try {
      if (!selectedUser && selectedUser?.length === 0) {
        Alert.alert("please add participants😏");
        return;
      }
      setIsSaving(true);
      const usersId = selectedUser.map((e) => e.uid);
      const usersName = selectedUser.map((e) => e.name);
      const chatRef = await child(dbRef, `Chats/${chatId}`);
      const updatedChatData = {
        ...chatData,
        users: [...chatData.users, ...usersId],
      };
      await update(chatRef, updatedChatData);

      for (let i = 0; i < usersId?.length; i++) {
        let userId = usersId[i];
        await push(child(dbRef, `UsersChats/${userId}`), chatId);
      }

      const chatsData = {};
      updatedChatData.key = chatId;
      chatsData[chatId] = updatedChatData;
      const moreAddedUser =
        selectedUser && selectedUser?.length > 1
          ? ` and ${selectedUser?.length - 1} others `
          : "";
      const messageText = `${usersName[0]} ${moreAddedUser}were added in group`;
      await sendMessage(
        chatId,
        loginUserData,
        messageText,
        (replyTo = null),
        (imageURL = null),
        (type = "userAdded"),
        chatData.users
      );
      await dispatch(updateChatData({ chatsData }));
      await dispatch(setStoredUsers({ newUsers: { selectedUser } }));
      Alert.alert("Participant's added successfully🤩");
      setIsSaving(false);
      setSelectedUser([]);
      setGroupName("");
      navigation.navigate("chatScreen", { chatId });
    } catch (error) {
      setIsSaving(false);
      Alert.alert("unable to add participants😌");
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isSaving ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 28,
              fontFamily: "Bold",
              color: "#6f4e37",
              alignSelf: "center",
            }}
          >
            CREATING GROUP 👩‍👩‍👧‍👦
          </Text>
          <FontAwesome5 name="smile-beam" size={200} color="#6f4e37" />
          <Text
            style={{
              fontSize: 25,
              fontFamily: "Bold",
              color: "#6f4e37",
              alignSelf: "center",
            }}
          >
            please wait........
          </Text>
        </View>
      ) : (
        <>
          {isGroupChat && !chatId && (
            <>
              <TouchableOpacity
                style={styles.imageContainer}
                onPress={() => imageHandler()}
              >
                {isLoading && !tempUri ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator size={70} color="#fff" />
                  </View>
                ) : (
                  <Image
                    source={tempUri ? { uri: tempUri } : userPic}
                    style={styles.image}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.editIconContainer}>
                  <MaterialCommunityIcons
                    name="pencil"
                    size={24}
                    color="black"
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.groupNameContainer}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={30}
                  color="#fff"
                  style={{ marginRight: 5, marginLeft: 5 }}
                />
                <TextInput
                  placeholder="Enter group name"
                  placeholderTextColor="#808080"
                  style={styles.groupTextInput}
                  value={groupName}
                  onChangeText={(e) => setGroupName(e)}
                  autoCapitalize="none"
                />
              </View>
            </>
          )}
          {chatId && (
            <View>
              <Image
                source={{ uri: chatData.groupProfilePic } ?? userPic}
                style={{
                  ...styles.image,
                  alignSelf: "center",
                  marginTop: 10,
                  width: 80,
                  height: 80,
                  borderWidth: 3,
                  borderColor: "#6f4e37",
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  alignSelf: "center",
                  fontSize: 20,
                  fontFamily: "Bold",
                  color: "#6f4e37",
                }}
              >
                {chatData.groupName}
              </Text>
            </View>
          )}
          {
            // SELECTED USER PROFILE BELOW GROUP NAME IMPUT ======================================>
            isGroupChat && selectedUser?.length > 0 && (
              <View style={{ paddingTop: 5 }}>
                <FlatList
                  ref={(ref) => (flatlistRef.current = ref)}
                  onContentSizeChange={() =>
                    flatlistRef.current.scrollToEnd({ animated: false })
                  }
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={selectedUser}
                  renderItem={(user) => {
                    //  console.log(user.item.uid)
                    return (
                      <TouchableOpacity
                        style={{ padding: 5, flexDirection: "row" }}
                        onPress={() => {
                          const newSelectedUsers = selectedUser.filter(
                            (u) => u.uid != user.item.uid
                          );
                          setSelectedUser(newSelectedUsers);
                        }}
                      >
                        <Entypo
                          name="cross"
                          size={20}
                          color="#fff"
                          style={{
                            position: "absolute",
                            right: 0,
                            backgroundColor: "#6f4e37",
                            zIndex: 1,
                            borderRadius: 50,
                          }}
                        />
                        <Image
                          style={{
                            borderRadius: 50,
                            borderWidth: 2,
                            borderColor: "#6f4e37",
                            width: 40,
                            height: 40,
                          }}
                          source={{ uri: user.item.ProfilePicURL }}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            )
          }
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
            //  WHILE SEARCHING USER ==================================================>
            isLoading && (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size={100} color="#6f4e37" />
              </View>
            )
          }
          {
            // SHOWING USER FLATLIST  ====================================================>
            !isLoading && !noUserFound && users && (
              <FlatList
                data={Object.keys(users)}
                renderItem={(itemData) => {
                  const userId = itemData.item;
                  const userData = users[userId];
                  // console.log(userData)
                  if (chatData && chatData.users.includes(userId)) {
                    return;
                  }
                  return (
                    <TouchableOpacity
                      style={styles.searchResultContainer}
                      onPress={
                        isGroupChat
                          ? () => {
                              const newSelectedUser = selectedUser
                                .map((e) => e.uid)
                                .includes(userData.uid)
                                ? selectedUser.filter(
                                    (user) => user.uid != userData.uid
                                  )
                                : selectedUser.concat(userData);
                              setSelectedUser(newSelectedUser);
                              //  setUserPressed(!userPressed)
                              //  console.log("user Selected")
                            }
                          : async () => {
                              navigation.navigate("ChatList", {
                                selectedUser: userData,
                              });
                              await dispatch(
                                setStoredUsers({ newUsers: { userData } })
                              );
                            }
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
                        <Text style={styles.searchUserTapToChat}>
                          {isGroupChat
                            ? "Press to select/unselect"
                            : "Tap to chat"}
                        </Text>
                      </View>
                      {isGroupChat ? (
                        <MaterialIcons
                          name={
                            selectedUser
                              .map((e) => e.uid)
                              .includes(userData.uid)
                              ? "check-box"
                              : "check-box-outline-blank"
                          }
                          size={35}
                          color="#6f4e37"
                          style={styles.searchUserArrow}
                        />
                      ) : (
                        <AntDesign
                          name="forward"
                          size={20}
                          color="#6f4e37"
                          style={styles.searchUserArrow}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )
          }
          {
            //  NO USER FOUND
            !isLoading && noUserFound && (
              <View style={styles.noUserContainer}>
                <Entypo name="emoji-sad" size={130} color="#6f4e37" />
                <Text style={styles.noUserText}>No user found</Text>
              </View>
            )
          }
          {
            //  WHEN SEARCH QUERY IS EMPTY
            !isLoading && !users && selectedUser?.length === 0 && (
              <View style={styles.noUserContainer}>
                <FontAwesome name="users" size={150} color="#6f4e37" />
                <Text style={styles.noUserText}>
                  Enter a name to search user
                </Text>
              </View>
            )
          }
        </>
      )}
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
  noUserContainer: {
    marginTop: 80,
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
    marginHorizontal: 5,
    borderRadius: 40,
    marginVertical: 1,
    paddingHorizontal: 10,
  },
  groupText: {
    fontSize: 17,
    fontFamily: "Bold",
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
    fontFamily: "BoldItalic",
    borderRadius: 40,
  },
  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    padding: 5,
    backgroundColor: "white",
    borderRadius: 40,
  },
  imageContainer: {
    alignSelf: "center",
    marginTop: 15,
    padding: 5,
    backgroundColor: "#6f4e37",
    width: 110,
    height: 110,
    borderRadius: 80,
    // paddingBottom:10,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 80,
  },
});
