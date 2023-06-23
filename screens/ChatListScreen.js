import { StyleSheet, Text, View, Button, ImageBackground } from 'react-native'
import React,{ useEffect } from 'react'
import backgroundImage from "../assets/images/navigatorBackground2.jpg";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../components/CustomHeaderButton';
import { useSelector } from 'react-redux';


const ChatListScreen = ({navigation}) => {

  const searchedUser = useSelector(state=>state.users);
  // console.log(searchedUser);

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
      }
    })
  },[]);

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