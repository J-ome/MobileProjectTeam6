import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { auth, db, USERS} from '../firebase/Config';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import firebase from 'firebase/app';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [links, setLinks] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

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
    // Save links and bio locally (not to Firebase)
    console.log('Links:', links);
    console.log('Bio:', bio);
  };

  const handleLogin = async (email, password) => {
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Login was successful
      const user = userCredential.user;
      console.log('Login successful:', user);
    } catch (error) {
      // Handling specific errors
      switch (error.code) {
        case 'auth/invalid-email':
          console.error('Invalid email address:', error.message);
          break;
        case 'auth/user-disabled':
          console.error('User account is disabled:', error.message);
          break;
        case 'auth/user-not-found':
          console.error('User not found:', error.message);
          break;
        case 'auth/wrong-password':
          console.error('Incorrect password:', error.message);
          break;
        default:
          console.error('Error logging in:', error.message);
          break;
      }
    }
  };

  const handleSignUp = async () => {
    try {
      console.log('Signing up...');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password, username, name);
      const user = userCredential.user;
      console.log('Sign-up successful:', user);
      storeUserData(user.uid, {
        // Add the user data you want to store in the database
        // For example:
        username: username,
        name: name,
        email: email,
        // Add other user data properties as needed
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
      // Additional logout logic if needed
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
    <View>
      {loggedIn ? (
        <View>
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
          <Button title="Save" onPress={handleSave} />
          <Button title="Logout" onPress={handleLogout} />
        </View>
      ) : (
        <View>
          <Text>Please log in or sign up to view your profile</Text>
          <TextInput
            value={signUpEmail}
            onChangeText={setSignUpEmail}
            placeholder="Enter email"
            inputMode="email"
            autoCapitalize="none"
          />
          <TextInput
            value={signUpPassword}
            onChangeText={setSignUpPassword}
            placeholder="Enter password"
            secureTextEntry
          />
          <Button title="Log in" onPress={handleLogin} />
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
            <Button title="Sign up" onPress={handleSignUp} />
        </View>
      )}
    </View>
  );
};

export default Profile;
