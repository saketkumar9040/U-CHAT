import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ErrorBubble = ({ text,style }) => {
  return (
    <View style={styles.bubbleContainer}>
      <View style={styles.bubbleContainerIn}>
        <Text style={{...styles.bubbleText,...style}}>{text}</Text>
      </View>
    </View>
  );
};

export default ErrorBubble;

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bubbleContainerIn: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop:40,
    paddingVertical:7,
    paddingHorizontal:40,
    elevation:10,
  },
  bubbleText: {
    fontSize: 17,
    color: "#6f4e37",
    fontFamily:"MediumItalic",
    textAlign:"center",
  },
});
