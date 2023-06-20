import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKmKGG_4t5q6NKUaXF-2rWS4reB0w-JfA",
  authDomain: "u-chat-db090.firebaseapp.com",
  projectId: "u-chat-db090",
  storageBucket: "u-chat-db090.appspot.com",
  messagingSenderId: "925228372711",
  appId: "1:925228372711:web:95fa170bd27eca1d838842",
  // DATABASE-URL ADDED TO MANAGE LOCATION ERROR  ====================================>
  databaseURL:"https://u-chat-db090-default-rtdb.asia-southeast1.firebasedatabase.app",
  measurementId: "G-1VJZB6DC45"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);