import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";
import { TouchableWithoutFeedback } from "react-native";
import { useRef } from "react";
import { useSelector } from "react-redux";

const MessageBubble = ({ data, loggedInUserUid }) => {
  const menuRef = useRef(null);
  const id = useRef(uuid.v4());
//   console.log(id.current);

  return (
    <View style={styles.messageContainer}>
        
        <TouchableWithoutFeedback
          onLongPress={() => menuRef.current.props.ctx.menuActions.openMenu(id.current)}
        >
          {data.sentBy === loggedInUserUid ? (
            <Text style={styles.sentMessageText}>{data.text}</Text>
          ) : (
            <Text style={styles.receivedMessageText}>{data.text}</Text>
          )}
        </TouchableWithoutFeedback>
        <Menu ref={menuRef} name={id.current} style={data.sentBy === loggedInUserUid ? styles.sentMessagePopUps:styles.receivedMessagePopUps}>
          <MenuTrigger />
          <MenuOptions>
            <MenuOption onSelect={() => alert(`Copied`)} text="Copy" />
            <MenuOption onSelect={() => alert(`Delete`)}>
              <Text style={{ color: "red" }}>Delete</Text>
            </MenuOption>
            <MenuOption
              onSelect={() => alert(`Not called`)}
              disabled={true}
              text="Disabled"
            />
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
  sentMessageText: {
    fontSize: 17,
    color: "#fff",
    backgroundColor: "#6f4e37",
    alignSelf: "flex-end",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 5,
    paddingHorizontal: 20,
    marginLeft: "20%",
    fontFamily: "MediumItalic",
    letterSpacing: 1,
  },
  receivedMessageText: {
    fontSize: 17,
    backgroundColor: "#fff",
    color: "#6f4e37",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 5,
    paddingHorizontal: 20,
    fontFamily: "BoldItalic",
    alignSelf: "flex-start",
    marginRight: "20%",
  },
  sentMessagePopUps:{
    alignSelf: "flex-end",
  },
  receivedMessagePopUps:{
    alignSelf: "flex-start",
  }
});
