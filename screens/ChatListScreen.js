import { StyleSheet, Text, View, Button, ImageBackground } from 'react-native'
import React,{ useEffect } from 'react'
import backgroundImage from "../assets/images/navigatorBackground2.jpg";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';
import { useSelector } from 'react-redux';


const ChatListScreen = ({navigation,route}) => {

  const selectedUser = route?.params?.selectedUser;
  // console.log(selectedUser)
  
  const userLoggedIn = useSelector(state=>state.auth.userData);
  // console.log(userLoggedIn);

  useEffect(()=>{
    navigation.setOptions({
      headerRight : () => {
        return <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
             title='newChat'
             iconName='create-outline'
             color="#fff"
             onPress={()=>{navigation.navigate("NewChatScreen")}}
          />
        </HeaderButtons>
      },
      headerLeft: () => {
         return (
          <View style={{marginLeft:20}}>
            <Text style={{fontSize:25,fontFamily:"BoldItalic",color:'#fff',letterSpacing:2,}}>CHATS</Text>
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

     navigation.navigate("ChatScreen",{chatUsers : [chatUsers]})
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