import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAKmKGG_4t5q6NKUaXF-2rWS4reB0w-JfA",
  authDomain: "u-chat-db090.firebaseapp.com",
  projectId: "u-chat-db090",
  storageBucket: "u-chat-db090.appspot.com",
  messagingSenderId: "925228372711",
  appId: "1:925228372711:web:95fa170bd27eca1d838842",
  measurementId: "G-1VJZB6DC45"
};

export const app = initializeApp(firebaseConfig);
console.log(app)