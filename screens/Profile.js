import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, USERS } from '../firebase/Config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/app';
import style from '../style/Style'
import { getAuth } from "firebase/auth";
import { signIn } from '../components/Auth';
import { useAuth } from '../components/AuthContext';

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
  const [profileImage, setProfileImage] = useState(null);

  const { user, logout } = useAuth
  ();

  useEffect(() => {
    // Check if user is authenticated
    if (user) {
      setLoggedIn(true);
      fetchUserData(user.uid);
      fetchProfileImage(user.uid);
    } else {
      setLoggedIn(false);
      setUserData(null);
    }
  }, [user]);

  const fetchProfileImage = async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData.profileImage) {
          setProfileImage(userData.profileImage);
        }
      } else {
        console.log('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
      setSignInEmail("");
      setEmail("");
      setSignInPassword("");
      setUsername("");
      setName("");
      setPassword("");
    } catch (error) {
      console.error('Login failed:', error.message);
      Alert.alert('Login failed:', error.message);
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


  const handleDeleteAccount = () => {
    // Ensure the user is authenticated before proceeding
    const user = auth.currentUser;
    if (user) {
      // Prompt the user to confirm account deletion
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your account?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => deleteAccount(),
            style: 'destructive',
          },
        ]
      );
    } else {
      console.log('User not authenticated');
    }
  };

  const deleteAccount = async () => {
    deleteUser(auth.currentUser)
      .then(() => {
        console.log("User was removed")
        setSignInEmail("");
        setSignInPassword("");
      }).catch((error) => {
        console.log("User delete error: ", error.message)
      })
  }

  const handleLaunchCamera = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        const pickedImage = result.assets[0];
        console.log('Picked image:', pickedImage);
        if (pickedImage && pickedImage.uri) {
          console.log('Image picked from camera:', pickedImage.uri);
          setProfileImage(pickedImage.uri);
          // Push the image URI to Firestore
          await pushImageToFirestore(pickedImage.uri);
        } else {
          console.log('No URI found in the picked image');
        }
      }
    } catch (error) {
      console.log('Error picking image from camera:', error);
    }
  };

  const handleLaunchImageLibrary = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        const pickedImage = result.assets[0];
        console.log('Picked image:', pickedImage);
        if (pickedImage && pickedImage.uri) {
          console.log('Image picked from library:', pickedImage.uri);
          setProfileImage(pickedImage.uri);
          // Push the image URI to Firestore
          await pushImageToFirestore(pickedImage.uri);
        } else {
          console.log('No URI found in the picked image');
        }
      }
    } catch (error) {
      console.log('Error picking image from library:', error);
    }
  };

  const pushImageToFirestore = async (imageUri) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
          profileImage: imageUri,
        });
        console.log('Profile image pushed to Firestore successfully');
      } else {
        console.log('User not authenticated');
      }
    } catch (error) {
      console.log('Error pushing profile image to Firestore:', error);
    }
  };

  const handleChooseProfilePicture = () => {
    Alert.alert(
      'Choose Profile Picture',
      'Would you like to choose from the gallery or take a photo?',
      [
        {
          text: 'Choose from Gallery',
          onPress: handleLaunchImageLibrary,
        },
        {
          text: 'Take a Photo',
          onPress: handleLaunchCamera,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };




  return (
    <>
      <View style={style.container}>
        {loggedIn ? (
          <View style={style.statusBar}>
            <Pressable onPress={handleChooseProfilePicture}><Text>Choose profile picture</Text></Pressable>
            {profileImage && <Image source={{ uri: profileImage }} style={{ width: 100, height: 100 }} />}

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
            <Pressable onPress={handleSave}>
              <Text>Save</Text>
            </Pressable>
            <Pressable onPress={handleLogout}>
              <Text>Logout</Text>
            </Pressable>
            <Pressable onPress={handleDeleteAccount}>
              <Text>Delete Account</Text>
            </Pressable>
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
            <Pressable onPress={handleLogin} >
              <Text>Log in</Text>
            </Pressable>
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
            <Pressable onPress={handleSignUp}>
              <Text>Sign Up</Text>
            </Pressable>
          </View>
        )}
      </View>
    </>
  );
};

export default Profile;
