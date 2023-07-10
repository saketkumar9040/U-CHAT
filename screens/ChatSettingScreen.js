import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { useSelector } from 'react-redux';
import groupPic from "../assets/images/group.png"
import ProfileImage from '../components/ProfileImage';

const ChatSettingScreen = ({navigation,route}) => {

    const chatId = route.params.chatId;
    const chatData = useSelector(state=>state.chats.chatsData[chatId]);
    // console.log(chatData);

  useEffect(()=>{
    navigation.setOptions({
      headerLeft:()=>{
        return(
          <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={25} color="#fff" />
          </TouchableOpacity>
          <Text style={{marginLeft:10,fontSize:25,fontFamily:"Bold",color:"#fff"}}>
            Chat settings
          </Text>
              </View>
        )
      }
    })
  },[])

  return (
    <ScrollView style={styles.container}>
       <ProfileImage chatId={chatId}/>
       <Text style={styles.userName}>{chatData.groupName.toUpperCase()}</Text>
    </ScrollView>
  )
}

export default ChatSettingScreen;

const styles = StyleSheet.create({
    container:{
        flex:1,
        // alignItems:"center",
        // justifyContent:"center",
        backgroundColor: "#ffbf00",
        paddingTop:20,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 5,
      backgroundColor:'#6f4e37'
    },
    imageContainer: {
      alignSelf: "center",
      marginTop: 15,
      padding:5,
     
      width: 140,
      height: 140,
      borderRadius: 80,
    },
    image: {
      width: 120,
      height: 120,
      borderRadius: 80,
      borderWidth:3,
      borderColor:'#6f4e37',
      backgroundColor:"#6f4e37",
    },
    userName:{
      marginTop:10,
      fontSize:25,
      fontFamily:"Bold",
      color:'#6f4e37',
      textAlign:"center",
    },
    userAbout:{
      marginTop:15,
      fontSize:20,
      fontFamily:"Bold",
      color:'#6f4e37',
      textAlign:"center",
    },
})