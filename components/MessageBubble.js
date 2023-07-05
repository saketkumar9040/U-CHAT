import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState, useRef } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";
import * as Clipboard from "expo-clipboard";
import {
  Entypo,
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { starMessage } from "../utils/ChatHandler";
import { useSelector } from "react-redux";
import { Image } from "react-native";

const MessageBubble = ({
  data,
  loggedInUserUid,
  chatId,
  setReply,
  replyingTo,
}) => {
  const menuRef = useRef(null);
  const id = useRef(uuid.v4());

  //   console.log(id.current);
  // console.log(selectedUser)
  // console.log(replyingTo)

  const storedUsers = useSelector((state) => state.users.storedUser);
  // console.log(storedUsers)

  const starredMessages = useSelector(
    (state) => state.messages.starredMessages[chatId] ?? {}
  );
  // console.log(starredMessages)

  const isStarred = starredMessages[data.key] !== undefined;
  const userReplied = replyingTo && storedUsers[replyingTo.sentBy];

  let displayDate;
  let date = new Date(data.sentAt);
  if (date.getHours() === 0) {
    displayDate = 12;
  } else {
    displayDate = date.getHours() > 12 ? date.getHours() - 12 : date.getHours();
    // console.log(date);
  }

  return (
    <View style={styles.messageContainer}>
      <TouchableWithoutFeedback
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
      >
        {data.sentBy === loggedInUserUid ? (
          <View style={styles.sentMessageContainer}>
            {userReplied && (
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: 5,
                  borderTopLeftRadius: 35,
                  margin: 3,
                }}
              >
                <Text
                  style={{
                    color: "#6f4e37",
                    fontFamily: "Medium",
                    padding: 3,
                    paddingLeft: 10,
                    textAlign: "center",
                  }}
                >
                  {replyingTo.text}
                </Text>
                <View style={{ flexDirection: "row", alignSelf: "flex-end" }}>
                  <Text
                    style={{
                      color: "#6f4e37",
                      fontFamily: "Medium",
                      padding: 2,
                      paddingLeft: 10,
                      alignSelf: "flex-end",
                    }}
                  >
                    {userReplied.name}
                  </Text>
                  <Image
                    source={{
                      uri: storedUsers[replyingTo.sentBy]?.ProfilePicURL,
                    }}
                    style={styles.userImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
            {data.text == "Image" && data?.imageURL ? (
              <Image
                style={styles.messageImage}
                source={{ uri: data?.imageURL }}
              />
            ) : (
              <Text style={styles.sentMessageText}>{data.text}</Text>
            )}
            <Text style={styles.sendDate}>
              {isStarred && <AntDesign name="star" size={20} color="yellow" />}
              {displayDate}:
              {date.getMinutes() > 9
                ? date.getMinutes()
                : `0${date.getMinutes()}`}{" "}
              {date.getHours() > 12 ? "PM" : "AM"}
            </Text>
          </View>
        ) : (
          <View style={styles.receivedMessageContainer}>
            {userReplied && (
              <View
                style={{
                  backgroundColor: "#6f4e37",
                  paddingLeft: 5,
                  borderTopRightRadius: 35,
                  margin: 3,
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    fontFamily: "Medium",
                    padding: 2,
                    textAlign: "center",
                  }}
                >
                  {replyingTo.text}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "flex-start",
                    paddingVertical: 5,
                  }}
                >
                  <Image
                    source={{
                      uri: storedUsers[replyingTo.sentBy]?.ProfilePicURL,
                    }}
                    style={styles.userImage}
                    resizeMode="contain"
                  />
                  <Text
                    style={{ color: "#fff", fontFamily: "Bold", padding: 2 }}
                  >
                    {userReplied.name}
                  </Text>
                </View>
              </View>
            )}
               {data.text == "Image" && data?.imageURL ? (
              <Image
                style={styles.messageImage}
                source={{ uri: data?.imageURL }}
              />
            ) : (
              <Text style={styles.receivedMessageText}>{data.text}</Text>
            )}
            <Text style={styles.receivedMessageText}>{data.text}</Text>
            <Text style={styles.receivedDate}>
              {displayDate}:
              {date.getMinutes() > 9
                ? date.getMinutes()
                : `0${date.getMinutes()}`}{" "}
              {date.getHours() > 12 ? "PM" : "AM"}
              {isStarred && <AntDesign name="star" size={20} color="green" />}
            </Text>
          </View>
        )}
      </TouchableWithoutFeedback>

      <Menu
        ref={menuRef}
        name={id.current}
        style={
          data.sentBy === loggedInUserUid
            ? styles.sentMessagePopUps
            : styles.receivedMessagePopUps
        }
      >
        <MenuTrigger />
        <MenuOptions>
          <MenuOption onSelect={setReply} style={styles.menuOptionsContainer}>
            <Text
              style={{
                flex: 1,
                color: "blue",
                fontFamily: "SemiBold",
                fontSize: 15,
              }}
            >
              Reply to
            </Text>
            <Entypo name="reply" size={24} color="blue" />
          </MenuOption>
          <MenuOption
            onSelect={async () => {
              await Clipboard.setStringAsync(data.text);
              Alert.alert(`Copied🤗`);
            }}
            style={styles.menuOptionsContainer}
          >
            <Text
              style={{
                flex: 1,
                color: "green",
                fontFamily: "SemiBold",
                fontSize: 15,
              }}
            >
              Copy to clipboard
            </Text>
            <Entypo name="clipboard" size={20} color="green" />
          </MenuOption>
          <MenuOption
            onSelect={async () => {
              await starMessage(loggedInUserUid, chatId, data.key);
            }}
            style={styles.menuOptionsContainer}
          >
            <Text
              style={{
                flex: 1,
                color: "orange",
                fontFamily: "SemiBold",
                fontSize: 15,
              }}
            >
              {isStarred ? "Unstar message" : "Star Message"}
            </Text>
            {isStarred ? (
              <MaterialCommunityIcons
                name="star-off"
                size={20}
                color="orange"
              />
            ) : (
              <AntDesign name="star" size={20} color="orange" />
            )}
          </MenuOption>
          <MenuOption
            onSelect={() => alert(`Delete`)}
            style={styles.menuOptionsContainer}
          >
            <Text
              style={{
                flex: 1,
                color: "red",
                fontFamily: "SemiBold",
                fontSize: 15,
              }}
            >
              Delete
            </Text>
            <MaterialIcons name="delete-forever" size={22} color="red" />
          </MenuOption>
        </MenuOptions>
      </Menu>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    marginVertical: 5,
  },
  sentMessageContainer: {
    flexDirection: "column",
    alignSelf: "flex-end",
    marginLeft: "20%",
    backgroundColor: "#6f4e37",
    borderTopLeftRadius: 40,
    borderBottomLeftRadius: 40,
    borderWidth: 2,
    borderRightWidth: 0,
    borderColor: "#fff",
    paddingBottom: 15,
  },
  sentMessageText: {
    fontSize: 17,
    color: "#fff",
    padding: 5,
    paddingTop: 10,
    paddingLeft: 40,
    paddingHorizontal: 20,
    // marginLeft: "10%",
    fontFamily: "MediumItalic",
    letterSpacing: 1,
    marginBottom: 5,
    textAlign: "center",
  },
  receivedMessageContainer: {
    flexDirection: "column",
    alignSelf: "flex-start",
    marginRight: "20%",
    borderTopRightRadius: 40,
    borderBottomRightRadius: 40,
    borderWidth: 4,
    borderLeftWidth: 0,
    borderColor: "#6f4e37",
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  receivedMessageText: {
    fontSize: 17,
    color: "#6f4e37",
    padding: 5,
    marginBottom: 10,
    paddingRight: 40,
    paddingHorizontal: 20,
    fontFamily: "BoldItalic",
    // marginRight: "20%",
    textAlign: "center",
  },
  sentMessagePopUps: {
    alignSelf: "flex-end",
    backgroundColor: "transparent",
  },
  receivedMessagePopUps: {
    alignSelf: "flex-start",
    backgroundColor: "transparent",
  },
  menuOptionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#6f4e37",
    borderRadius: 4,
  },
  sendDate: {
    position: "absolute",
    right: 5,
    bottom: 3,
    color: "#fff",
    fontSize: 12,
    fontFamily: "Light",
  },
  receivedDate: {
    position: "absolute",
    left: 5,
    bottom: 3,
    color: "#6f4e37",
    fontSize: 13,
    fontFamily: "Light",
  },
  userImage: {
    width: 30,
    height: 30,
    marginLeft: 5,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#6f4e37",
  },
  messageImage: {
    marginVertical: 20,
    marginLeft:20,
    marginRight:10,
    height: 300,
    width: 200,
    // borderRadius:20
  },
});
