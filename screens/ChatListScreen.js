import { StyleSheet, Text, View, Button } from 'react-native'
import React from 'react'


const ChatListScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={{fontSize:20 ,color:"black"}}>ChatListScreen</Text>
      <Button title='Go To Settings' onPress={()=>navigation.navigate("ChatSettingScreen")}/>
    </View>
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