import React, { useEffect, useState } from 'react';
import { View, Text, Alert, Pressable, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, USERS } from '../firebase/Config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/app';
import style from '../style/Style'
import { getAuth } from "firebase/auth";
import { signIn } from '../components/Auth';
import { useAuth } from '../components/AuthContext';
import { TextInput, Button } from 'react-native-paper';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import MyRecipes from '../screens/MyRecipes'
import { useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation();

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
      setProfileImage(null);
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

  const handleViewMyRecipes = () => {
    navigation.navigate('MyRecipes');
  };

  const handleViewIntolerances = () => {
    navigation.navigate('Intolerances');
  };
  

  return (
    <>
      <View style={style.container}>
        <GestureHandlerRootView>
        <ScrollView>
      <Text style={style.header}>Profile</Text>
      <View style={style.screenContent}>
        {loggedIn ? (
          <View >
            <View style={style.profileImageContent}>
            <Pressable onPress={handleChooseProfilePicture} style={style.profileImageBtn}>
              <Text style={style.profileImageText}>Choose profile picture</Text>
            </Pressable>
            {profileImage && <Image source={{ uri: profileImage }} style={style.profileImage} />}
            </View>
            <View style={style.profileContent}>
            {userData && (
              <>
                <Text style={style.profileText}>Name: {userData.name}</Text>
                <Text style={style.profileText}>Username: {userData.username}</Text>
                <Text style={style.profileText}>Email: {userData.email}</Text>
              </>
            )}
            <Text style={style.profileText}>Links:</Text>
            <TextInput
              value={links}
              onChangeText={setLinks}
              multiline
              mode='outlined'
              style={style.profileInput}
              label={'Enter links'}
            />
            <Text style={style.profileText}>Bio:</Text>
            <TextInput 
              value={bio}
              onChangeText={setBio}
              multiline
              mode='outlined'
              style={style.profileInput}
              label={'Enter bio'}
            />
            <Pressable onPress={handleSave} style={style.save}>
              <Text style={style.saveText}>Save</Text>
            </Pressable>
            <Text>You can find your own recipes <Pressable onPress={handleViewMyRecipes}><Text style={style.profileBtn}>HERE</Text></Pressable>.</Text>
            <Text>You can find the meanings of dietaries <Pressable onPress={handleViewIntolerances}><Text>HERE</Text></Pressable>.</Text>
            {/* <Button onPress={handleSave} style={style.save} mode='contained-tonal'>Save</Button> */}
            <View style={style.logoutDelete}>
            {/* <Pressable onPress={handleLogout}>
              <Text>Logout</Text>
            </Pressable> */}
            <Button onPress={handleLogout} mode='contained-tonal'>Logout</Button>
            {/* <Pressable onPress={handleDeleteAccount}>
              <Text>Delete Account</Text>
            </Pressable> */}
            <Button onPress={handleDeleteAccount} 
            // style={{backgroundColor: '#efa0a0'}} 
            mode='contained-tonal'>Delete Account</Button>
            </View>
            </View>
          </View>
        ) : (
          <View style={style.profileContent}>
            <Text style={style.title}>Please log in or sign up to view your profile</Text>
            <TextInput
              value={signInEmail}
              onChangeText={setSignInEmail}
              inputMode="email"
              autoCapitalize="none"
              mode='outlined'
              style={style.textInput}
              label={'Enter email'}
            />
            <TextInput
              value={signInPassword}
              onChangeText={setSignInPassword}
              secureTextEntry
              mode='outlined'
              style={style.textInput}
              label={'Enter password'}
            />
            {/* <Pressable 
              onPress={handleLogin} 
              style={style.btn}>
              <Text style={style.title}>Log in</Text>
            </Pressable> */}
            <Button
              onPress={handleLogin}
              style={style.btn}
              mode='contained'>Log in</Button>
            <TextInput
              value={name}
              onChangeText={setName}
              mode='outlined'
              style={style.textInput}
              label={'Enter name'}
            />
            <TextInput
              value={username}
              onChangeText={setUsername}
              mode='outlined'
              style={style.textInput}
              label={'Enter username'}
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              mode='outlined'
              style={style.textInput}
              label={'Enter email'}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode='outlined'
              style={style.textInput}
              label={'Enter password'}
            />
            {/* <Pressable 
              onPress={handleSignUp}
              style={style.btn}>
              <Text style={style.title}>Sign Up</Text>
            </Pressable> */}
            <Button
              onPress={handleSignUp}
              style={style.btn}
              mode='contained'>Sign up</Button>
          </View>
        )}
        </View>
        </ScrollView>
        </GestureHandlerRootView>
      </View>
    </>
  );
};

export default Profile;
