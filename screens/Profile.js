import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { auth, db, USERS, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase/Config';
import { doc, setDoc } from 'firebase/firestore';
import firebase from 'firebase/app'

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [links, setLinks] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
      const userDataSnapshot = await firebase.database().ref(`users/${userId}`).once('value');
      const userData = userDataSnapshot.val();
      setUserData(userData);
   } catch (error) {
      console.error('Error fetching user data:', error);
   }
  };

  const handleSave = () => {
    // Save links and bio locally (not to Firebase)
    console.log('Links:', links);
    console.log('Bio:', bio);
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      const userId = user.uid; // Retrieve the unique user ID
      // Now you can retrieve the user data from the database using the userId
      // For example:
      const userDataSnapshot = await firebase.database().ref(`users/${userId}`).once('value');
      const userData = userDataSnapshot.val();
      console.log('User data:', userData);
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await getAuth().createUserWithEmailAndPassword(email, password)
      const user = userCredential.user;
      const userId = user.uid;
      storeUserData(userId, userData);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };
  
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Additional logout logic if needed
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  // Function to store user data in the database
  const storeUserData = (userId, userData) => {
    // Store user data in Firestore or Realtime Database
    // ...
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
          <Button title="Log in" onPress={handleLogin} />
          <Button title="Sign up" onPress={handleSignUp} />
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
        </View>
      )}
    </View>
  );
};

export default Profile;
