import { StyleSheet, Image, View ,TouchableOpacity} from 'react-native'
import React from 'react'
import userPic from "../assets/images/userProfile.png";
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ProfileImage = () => {
  return (
    <TouchableOpacity style={styles.container}>
      <Image
         source={userPic}
         style={styles.image}
      />
     <View style={styles.editIconContainer}>
     <MaterialCommunityIcons name="pencil" size={24} color="black" />
     </View>
    </TouchableOpacity>
  )
}

export default ProfileImage

const styles = StyleSheet.create({
    container:{
      alignSelf:"center",
      paddingTop:15,
    },
    image:{
        width:150,
        height:150,
        borderRadius:80,
    },
    editIconContainer:{
        position:"absolute",
        bottom:10,
        right:0,
        padding:8,
        backgroundColor:"white",
        borderRadius:40,
    }
})