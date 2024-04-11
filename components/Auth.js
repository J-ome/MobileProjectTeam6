import { signInWithEmailAndPassword  } from "firebase/auth";
import { auth } from '../firebase/Config';

export const signIn = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      console.log("Logged successful.");
    })
    .catch((error) => {
      console.log("Login failed. ", error.message);
      Alert.alert("Login failed. ", error.message);
    })
  }