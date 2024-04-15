import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, Pressable } from 'react-native';
import { auth, db, USERS} from '../firebase/Config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebase from 'firebase/app';
import style from '../style/Style'
import { getAuth } from "firebase/auth";
import { signIn } from '../components/Auth';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [links, setLinks] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        fetchUserData(user.uid);
      } else {
        setLoggedIn(false);
        setUserData(null);
      }
    });
    return () => unsubscribe(); // Cleanup function to unsubscribe from the auth state listener
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        setUserData(userData);
      } else {
        console.log('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
}

  const handleSave = () => {
    console.log('Links:', links);
    console.log('Bio:', bio);
  };

  const handleLogin = async () => {
    if (!signInEmail || !signInPassword) {
      Alert.alert('Email and password are required.');
      return;
    }
  
    try {
      await signIn(signInEmail, signInPassword);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error.message);
      Alert.alert('Login failed:', error.message);
    }
  };

//   const handleLogin = async (email, password) => {
//     try {
//       const auth = getAuth();
//       const userCredential = signInWithEmailAndPassword(auth, email, password);
//       // Login was successful
//       const user = userCredential.user;
//       console.log('Login successful:', user);
//     } catch (error) {
//       // Handling specific errors
//       switch (error.code) {
//         case 'auth/invalid-email':
//           console.error('Invalid email address:', error.message);
//           break;
//         case 'auth/user-disabled':
//           console.error('User account is disabled:', error.message);
//           break;
//         case 'auth/user-not-found':
//           console.error('User not found:', error.message);
//           break;
//         case 'auth/wrong-password':
//           console.error('Incorrect password:', error.message);
//           break;
//         default:
//           console.error('Error logging in:', error.message);
//           break;
//       }
//     }
//   };

  const handleSignUp = async () => {
    try {
      console.log('Signing up...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, username, name);
      const user = userCredential.user;
      console.log('Sign-up successful:', user);
      storeUserData(user.uid, {
        // Add the user data you want to store in the database
        username: username,
        name: name,
        email: email,
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Error signing up:', errorMessage);
    }
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setSignInEmail("");
      setEmail("");
      setSignInPassword("");
      setUsername("");
      setName("");
      setPassword("");
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const storeUserData = async (userId, userData) => {
    try {
      // Reference to the document for the user in the 'users' collection
      const userDocRef = doc(db, 'users', userId);
  
      // Set the user data in the document
      await setDoc(userDocRef, userData);
  
      console.log('User data stored successfully:', userData);
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

  return (
    <View style={style.container}>
      {loggedIn ? (
        <View style={style.statusBar}> 
          {userData && (
            <>
              <Text>Name: {userData.name}</Text>
              <Text>Username: {userData.username}</Text>
              <Text>Email: {userData.email}</Text>
            </>
          )}
          <Text>Links:</Text>
          <TextInput
            value={links}
            onChangeText={setLinks}
            placeholder="Enter links"
            multiline
          />
          <Text>Bio:</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Enter bio"
            multiline
          />
          <Pressable onPress={handleSave}>Save</Pressable>
          <Pressable onPress={handleLogout}>Logout</Pressable>
        </View>
      ) : (
        <View style={style.statusBar}>
          <Text>Please log in or sign up to view your profile</Text>
          <TextInput
            value={signInEmail}
            onChangeText={setSignInEmail}
            placeholder="Enter email"
            inputMode="email"
            autoCapitalize="none"
          />
          <TextInput
            value={signInPassword}
            onChangeText={setSignInPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          <Pressable onPress={handleLogin} >Log in</Pressable>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
          />
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter email"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          <Pressable onPress={handleSignUp}> Sign Up </Pressable>
        </View>
      )}
    </View>
  );
};

export default Profile;
