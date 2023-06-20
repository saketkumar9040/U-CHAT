import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/customHeaderButton";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";

const NewChatScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState();
  const [searchText, setSearchText] = useState("");
  const [noUserFound, setNoUserFound] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="newChat"
              iconName="ios-close-sharp"
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="    >>>  Search here 🧐  <<< "
          placeholderTextColor="#000"
          selectionColor="#000"
          style={styles.textInput}
          onChangeText={(e) => {
            setSearchText(e);
          }}
        />
        <TouchableOpacity>
          <FontAwesome name="search" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      {!isLoading && noUserFound && (
        <View style={styles.userContainer}>
          <Entypo name="emoji-sad" size={130} color="#6f4e37" />
          <Text style={styles.noUserText}>No user found</Text>
        </View>
      )}
      {!isLoading && !users && (
        <View style={styles.userContainer}>
          <FontAwesome name="users" size={150} color="#6f4e37" />
          <Text style={styles.noUserText}>Enter a name to search user</Text>
        </View>
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
});
