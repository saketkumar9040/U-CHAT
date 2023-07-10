import { Image, Linking, StyleSheet, Text, View } from 'react-native'
import React,{useEffect, useState} from 'react'
import { TouchableOpacity } from 'react-native'
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import ProfileImage from '../components/ProfileImage';
import { getOtherUserChats } from '../utils/ChatHandler';
import userProfilePic from "../assets/images/group.png";


const ContactScreen = ({navigation,route}) => {
    // console.log(route.params);
    const [commonChats,setCommonChats] = useState([]);
    // console.log(commonChats)
    const storedUsers = useSelector(state=>state.users.storedUser);
    const currentUser = storedUsers[route.params.otherUserUid]
    const storedChats = useSelector(state=>state.chats.chatsData);
    // console.log(storedChats)

    useEffect(()=>{
        const getUserChats = async()=>{
           const currentUserChats =await getOtherUserChats(currentUser.uid);
           setCommonChats(Object.values(currentUserChats).filter(cid => storedChats[cid] && storedChats[cid].groupName))
        }
        getUserChats();
    },[])
  
    navigation.setOptions({
        headerLeft:()=>{
            return(
                <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
              <AntDesign name="arrowleft" size={25} color="#fff" />
            </TouchableOpacity>
            <Text style={{marginLeft:10,fontSize:25,fontFamily:"Bold",color:"#fff"}}>
              Contact Info
            </Text>
                </View>
            )
        },
        headerRight:()=>{
            return(
                <View style={{...styles.headerContainer,paddingRight:15,}}>
                    <TouchableOpacity onPress={()=>Linking.openURL(`tel:${currentUser.number}`)}>
                    <Feather name="phone" size={24} color="#fff" style={{paddingRight:15,}}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>Linking.openURL(`mailto:${currentUser.email}`)}>
                    <MaterialCommunityIcons name="email-outline" size={29} color="#fff" /> 
                    </TouchableOpacity>
                </View>
            )
        }
    })

  return (
    <View style={styles.container}>
        <View styel={styles.imageContainer}>
        <Image source={{uri:currentUser.ProfilePicURL}} style={styles.image} resizeMode="contain"/>
        </View>
       <Text style={styles.userName}>{currentUser.name.toUpperCase()}</Text>
       <Text style={styles.userAbout}>{currentUser.about}</Text>
       {
         commonChats.length > 0 && <>
           <Text style={styles.commonChatsText}>{commonChats.length}-{commonChats.lenght===1?"group":"group's"} in common</Text>
           <View style={{flexDirection: 'row', alignItems: 'center'}}>
           <View style={{flex: 1, height: 2, backgroundColor: '#6f4e37',marginBottom:10,}} />
           </View>
           {
            
            commonChats.map(cid=>{
                const chatData = storedChats[cid]
                // console.log(cid)
                return(
                    <View style={{flexDirection:'row',alignItems:"center",justifyContent:"center"}}>
                    <TouchableOpacity
                    style={styles.searchResultContainer}
                    onPress={() => {
                      navigation.push("ChatScreen",{
                      chatId:cid,
                      groupName:chatData.groupName
                    })}
                   }
                  >
                      <Image
                      source={chatData?.groupProfilePic?{ uri: chatData.groupProfilePic }: userProfilePic }
                      style={styles.searchUserImage}
                      resizeMode="contain"
                    /> 
                    <View style={styles.searchUserTextContainer}>
                      <Text style={styles.searchUserName}>
                        {chatData?.groupName}
                      </Text>
                      <Text style={styles.latestMessageText}>{chatData?.latestMessageText?chatData?.latestMessageText.substring(0,20):""}</Text>
                    </View>
                    <AntDesign name="rightcircleo" size={24} color="#6f4e37" style={{position:'absolute',right:10,top:20,}} />
                  </TouchableOpacity>
                  </View>
                )
            }
            )
           }
           
         </>
       }
    </View>
  )
}

export default ContactScreen

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 5,
      },
      container: {
        flex: 1,
        backgroundColor: "#ffbf00",
        padding: 5,
        paddingTop:10,
        alignItems: "center",
      },
      imageContainer: {
        alignSelf: "center",
        marginTop: 15,
        padding:5,
        backgroundColor:"#6f4e37",
        width: 140,
        height: 140,
        borderRadius: 80,
      },
      image: {
        width: 120,
        height: 120,
        borderRadius: 80,
        borderWidth:3,
        borderColor:'#6f4e37'
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
      inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#6f4e37",
        marginVertical: 5,
        marginHorizontal: 20,
        // paddingHorizontal: 10,
        paddingLeft: 15,
        borderRadius: 10,
      },
      textInput: {
        width: "90%",
        color: "#000",
        paddingLeft: 20,
        // paddingVertical: 5,
        marginVertical: 5,
        fontSize: 20,
        backgroundColor: "#fff",
        marginLeft: 10,
        fontFamily: "BoldItalic",
        letterSpacing:2,
      },
      commonChatsText:{
        marginTop:20,
        marginLeft:10,
        fontSize:20,
        fontFamily:'Bold',
        letterSpacing:1,
        color:"#6f4e37",
        alignSelf:"flex-start",
      },
      searchResultContainer: {
        flex:1,
        flexDirection: "row",
        alignSelf: "flex-start",
        height: 80,
        paddingHorizontal: 10,
        // marginTop:10,
        marginHorizontal: 5,
        // elevation:5,
      },
      searchUserImage: {
        width: 60,
        height: 60,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#6f4e37",
        marginRight: 5,
        
      },
      searchUserTextContainer: {
        flexDirection: "column",
        marginLeft: 10,
      },
      latestMessageText: {
        fontSize: 15,
        color: "#6f4e37",
        fontFamily: "MediumItalic",
      },
      searchUserName: {
        fontSize: 22,
        color: "#6f4e37",
        fontFamily: "Bold",
      },
})