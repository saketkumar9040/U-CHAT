import { StyleSheet, Image, View, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import userPic from "../assets/images/userProfile.png";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { deletePreviousProfilePic, launchImagePicker, uploadImage } from "../utils/ImagePickerHelper";
import { child, getDatabase, ref, update } from "firebase/database";
import { useDispatch } from "react-redux";
import { updateUserData } from "../store/authSlice";
import { ActivityIndicator } from "react-native";

const ProfileImage = ({userData}) => {
  
  const dispatch = useDispatch();

  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState("");

  const previousImage = userData.imageName;
  // console.log(previousImage)

  const pickImage = async () => {
    try {
      setIsLoading(true);
      let tempUri = await launchImagePicker();
      if(!tempUri){
        return
      }
      // console.log(tempUri);
      setImage(tempUri);

      // UPLOAD IMAGE TO STORAGE ==============================================>
      let uploadedURL = await uploadImage(tempUri);
      if(!uploadedURL){
        return
      }
      // console.log(uploadedURL);
      const {URL,imageName}=uploadedURL

      // SAVE URL LINK TO DATABASE ============================================>
      const updatedUserData={
        ...userData,
        ProfilePicURL:URL,
        imageName:imageName
      };
      const dbRef = ref(getDatabase());
      const childRef = child(dbRef, `UserData/${userData.uid}`);
      await update(childRef, updatedUserData);
      setIsLoading(false);
      Alert.alert("Profile pic updated successfully 😎");
      
      // REMOVE PREVIOUS SAVED PROFILE PIC ====================================>
      if(previousImage){
        await deletePreviousProfilePic(previousImage);
      }

       await dispatch(updateUserData({updatedUserData}));

    } catch (error) {
      setIsLoading(false);
      Alert.alert("Error😞","failed to update profile Pic")
      console.log(error);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={pickImage}>
      { isLoading ?(
        <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
          <ActivityIndicator size={70} color="#fff"/>
        </View>
      ):(
        <Image source={userData.ProfilePicURL ? {uri:userData.ProfilePicURL}: userPic} style={styles.image} resizeMode="contain"/>
      )
    }
      <View style={styles.editIconContainer}>
        <MaterialCommunityIcons name="pencil" size={24} color="black" />
      </View>
    </TouchableOpacity>
  );
};

export default ProfileImage;

const styles = StyleSheet.create({
  container: {
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
  },
  editIconContainer: {
    position: "absolute",
    bottom: 10,
    right: 0,
    padding: 5,
    backgroundColor: "white",
    borderRadius: 40,
  },
});
