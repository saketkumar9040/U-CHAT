import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import ProfileImage from '../components/ProfileImage'

const ContactScreen = ({navigation,route}) => {
    // console.log(route.params);
    const storedUsers = useSelector(state=>state.users.storedUser);
    const currentUser = storedUsers[route.params.otherUserUid]
    // console.log(currentUser)
  
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
                    <TouchableOpacity>
                    <Feather name="phone" size={24} color="#fff" style={{paddingRight:15,}}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
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
       <Text style={{fontSize:20,marginVertical:10,marginBottom:20,}}>{currentUser.about}</Text>
       <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={25} color="#fff" />
          <Text
            style={{
              ...styles.textInput,
              color: "#fff",
              backgroundColor: "#6f4e37",
            }}
          >
            {currentUser.email}
          </Text>
        </View>
        <View style={styles.inputContainer}>
          <Feather name="phone" size={24} color="#fff" />
          <Text
            style={{
              ...styles.textInput,
              color: "#fff",
              backgroundColor: "#6f4e37",
            }}
          >
            {currentUser.number}
          </Text>
        </View>
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
        alignItems: "center",
      },
      imageContainer: {
        alignSelf: "center",
        marginTop: 15,
        padding:5,
        backgroundColor:"#6f4e37",
        width: 160,
        height: 160,
        borderRadius: 80,
      },
      image: {
        width: 150,
        height: 150,
        borderRadius: 80,
        borderWidth:3,
        borderColor:'#6f4e37'
      },
      userName:{
        marginTop:10,
        fontSize:32,
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
})