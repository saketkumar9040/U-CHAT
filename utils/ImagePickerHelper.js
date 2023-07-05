import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";
import { storage } from "../firebase/FirebaseConfig";
import { getDownloadURL, ref, uploadBytesResumable,deleteObject } from "firebase/storage";

export const launchImagePicker = async () => {
  await checkMediaPermission();

//   const dispatch = useDispatch();

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });
  if (result.assets[0].uri) {
    //    console.log(result.assets[0].uri);
    return result.assets[0].uri;
  }
};

export const uploadImage = async (uri,isChatImage=false) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });
//   console.log(blob.data.name);
  let imageName= blob.data.name;
  const pathFolder = isChatImage ? "ChatImages" : "ProfilePics"
  const storageRef = ref(storage, `${pathFolder}/${blob.data.name}`);
  await uploadBytesResumable(storageRef, blob);
  let URL= await getDownloadURL(storageRef);
  return {URL,imageName}
};

export const checkMediaPermission = async () => {
  if (Platform.OS !== "web") {
    permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      return Promise.reject("Permission needed to access your image library");
    }
  }
  Promise.resolve();
};

export const deletePreviousProfilePic = async (ImageName) => {
    const storageRef = ref(storage, `ProfilePics/${ImageName}`);
    return await deleteObject(storageRef);
};

