import { StyleSheet, Text, View } from "react-native";
import React from "react";

const Bubble = ({ text,style }) => {
  return (
    <View style={styles.bubbleContainer}>
      <View style={styles.bubbleContainerIn}>
        <Text style={{...styles.bubbleText,...style}}>{text}</Text>
      </View>
    </View>
  );
};

export default Bubble;

const styles = StyleSheet.create({
  bubbleContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  bubbleContainerIn: {
    backgroundColor: "#fff",
    borderRadius: 50,
    margin:10,
    padding:5,
    paddingHorizontal:40,
    width:"70%",
    elevation:10,
  },
  bubbleText: {
    fontSize: 17,
    color: "#6f4e37",
    fontFamily:"MediumItalic",
    letterSpacing:2,
    textAlign:"center",
  },
});
