import { StyleSheet, Text, View , TouchableWithoutFeedback, Alert  } from "react-native";
import React,{ useState, useRef  } from "react";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import uuid from "react-native-uuid";
import * as Clipboard from 'expo-clipboard';

const MessageBubble = ({ data, loggedInUserUid }) => {

  const [copiedText,setCopiedText] = useState("");
  console.log(copiedText);

  const menuRef = useRef(null);
  const id = useRef(uuid.v4());
//   console.log(id.current);

const copyToClipBoardHandler = async(text) => {
   await Clipboard.setStringAsync(text);
    setCopiedText(text)
}

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
            <MenuOption 
               onSelect={() =>{ 
                copyToClipBoardHandler(data.text)
                Alert.alert(`Copied🤗`)
            }} 
               text="Copy to clipboard" />
            <MenuOption 
               onSelect={() =>{ 
                Alert.alert(`Starred🤩`)
            }} 
               text="Starred message" />
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
    paddingTop:10,
    paddingHorizontal: 20,
    marginLeft: "20%",
    fontFamily: "MediumItalic",
    letterSpacing: 1,
    borderWidth:2,
    borderRightWidth:0,
    borderColor:"#fff",
  },
  receivedMessageText: {
    fontSize: 17,
    backgroundColor: "#fff",
    color: "#6f4e37",
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    padding: 5,
    paddingTop:10,
    paddingHorizontal: 20,
    fontFamily: "BoldItalic",
    alignSelf: "flex-start",
    marginRight: "20%",
    borderWidth:4,
    borderLeftWidth:0,
    borderColor:"#6f4e37",
  },
  sentMessagePopUps:{
    alignSelf: "flex-end",
  },
  receivedMessagePopUps:{
    alignSelf: "flex-start",
  }
});
