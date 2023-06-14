import { StyleSheet, Text, View, Button, ImageBackground } from 'react-native'
import React from 'react'
import backgroundImage from "../assets/images/navigatorBackground2.jpg"


const ChatListScreen = ({navigation}) => {
  return (
    <ImageBackground 
     source={backgroundImage}
     style={styles.container}
     resizeMode='cover'
    >
      <Text style={{fontSize:25 ,color:"black",backgroundColor:"#fff"}}>ChatListScreen</Text>
      <Button title='Go To Chats' onPress={()=>navigation.navigate("ChatScreen")}/>
    </ImageBackground>
  )
}

export default ChatListScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        justifyContent:"center",
        backgroundColor: "#ffbf00",
    }
})