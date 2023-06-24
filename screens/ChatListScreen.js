import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native'
import React,{ useEffect } from 'react'
import backgroundImage from "../assets/images/navigatorBackground2.jpg";
import { useSelector } from 'react-redux';
import { Ionicons, FontAwesome } from '@expo/vector-icons';


const ChatListScreen = ({navigation,route}) => {

  const selectedUser = route?.params?.selectedUser;
  // console.log(JSON.stringify(selectedUser))
  
  const userLoggedIn = useSelector(state=>state.auth.userData);
  // console.log(userLoggedIn);

  const storedUser = useSelector(state => state?.users?.storedUser);
  // console.log("stored user "+JSON.stringify(storedUser))

  useEffect(()=>{
    navigation.setOptions({
      headerRight : () => {
        return (
          <TouchableOpacity 
             style={{flexDirection:"row",marginRight:20,alignItems:"center"}} 
             onPress={()=>navigation.navigate("NewChatScreen")}>
          <FontAwesome name="search" size={26} color="#fff" />
        </TouchableOpacity>
        )
      },
      headerLeft: () => {
         return (
          <View style={{flexDirection:"row",marginLeft:20,alignItems:"center"}}>
            <Text style={{fontSize:23,fontFamily:"BoldItalic",color:'#fff',letterSpacing:2,paddingRight:10,}}>CHATS</Text>
            <Ionicons name="chatbubble-ellipses" size={30} color="#fff" />
          </View>
         )
      }
    })
  },[]);

  useEffect(()=>{
    //  console.log(selectedUser);
     if(!selectedUser){
      return
     }
     const chatUsers = [selectedUser,userLoggedIn]

     navigation.navigate("ChatScreen",{chatUsers : chatUsers})
  },[selectedUser])

  return (
    <ImageBackground 
     source={backgroundImage}
     style={styles.container}
     resizeMode='cover'
    >
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