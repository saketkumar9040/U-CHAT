import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ChatSettingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize:20 ,color:"black"}}>ChatListScreen</Text>
    </View>
  )
}

export default ChatSettingScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: "#ffbf00",
    }
})