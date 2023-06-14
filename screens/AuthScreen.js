import { StyleSheet, Text, View ,TextInput} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ImageBackground } from 'react-native'
import backgroundImage from "../assets/images/navigatorBackground.jpg"


const AuthScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
        <ImageBackground source={backgroundImage}>
    <View style={styles.inputContainer}>
       <Text style={styles.text}>NAME</Text>
       <TextInput placeholder="Enter Your Name" placeholderTextColor="#fff" style={styles.textInput} selectionColor="#fff"/>
    </View>
    <View style={styles.inputContainer}>
       <Text style={styles.text}>EMAIL</Text>
       <TextInput placeholder="Enter Your E-mail" placeholderTextColor="#fff" style={styles.textInput} selectionColor="#fff"/>
    </View>
    <View style={styles.inputContainer}>
       <Text style={styles.text}>PHONE</Text>
       <TextInput placeholder="Enter Your Phone Number" placeholderTextColor="#fff" style={styles.textInput} selectionColor="#fff"/>
    </View>
    <View style={styles.inputContainer}>
       <Text style={styles.text}>ADDRESS</Text>
       <TextInput placeholder="Enter Your Address" placeholderTextColor="#fff" style={styles.textInput} selectionColor="#fff"/>
    </View>
    </ImageBackground>
    </SafeAreaView>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
   container:{
       flex:1
   },
   inputContainer:{
      marginVertical:10,
   },
   textInput:{
      backgroundColor:"#6f4e37",
      padding:8,
      color:"#fff",
      borderRadius:10,
      paddingHorizontal:20,
      marginVertical:10,
      fontSize:20,
   },
   text:{
    color:"#6f4e37",
    fontSize:20,
    fontWeight:600,
    textAlign:"center",
   }
})