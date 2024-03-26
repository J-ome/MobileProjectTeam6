// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAz-ShWE4BxqRr9GKRhkroMTx29GEgIIPQ",
  authDomain: "mobileprojectteam6.firebaseapp.com",
  projectId: "mobileprojectteam6",
  storageBucket: "mobileprojectteam6.appspot.com",
  messagingSenderId: "727874849022",
  appId: "1:727874849022:web:2355481046a8383b063daf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
  export { auth };
