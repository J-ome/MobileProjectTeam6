import React, { useState, useEffect} from 'react';
import { useNavigation } from "@react-navigation/native";
import { doc, collection, addDoc, getDoc, setDoc } from 'firebase/firestore';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import {auth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/Config';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../components/AuthContext';
import Style from '../style/Style';
import { TextInput, Button } from 'react-native-paper';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytesResumable, fetch, response } from 'firebase/storage';
import * as FileSystem from 'expo-file-system';

const AddRecipe = () => {
    const { user } = useAuth();
    const [recipe, setRecipe] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        image: '',
    });
    const [uploading, setUploading] = useState(false);
    const [image, setImage] = useState(null);
    const navigation = useNavigation();
    const storage = getStorage();
    const storageRef = ref(storage);
    const imagesRef = ref(storage, 'images');

 

    const handleChange = (name, value) => {
        setRecipe({
            ...recipe,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        if (!recipe.title || !recipe.ingredients || !recipe.instructions || !image) {
            alert('Please fill in all fields and select an image');
            return;
        }
    
        try {
            setUploading(true); // Start uploading
            const imageUrl = await uploadImage(); // Upload image to Firebase Storage and get the download URL
            await addRecipeToFirestore(imageUrl); // Add recipe to Firestore with the uploaded image URL
            alert('Recipe added successfully!');
            setRecipe({
                title: '',
                ingredients: '',
                instructions: '',
                image: null,
            });
        } catch (error) {
            console.error('Error adding recipe: ', error);
            alert('An error occurred while adding the recipe.');
        } finally {
            setUploading(false); // Stop uploading
        }
    };

    const addRecipeToFirestore = async (imageUrl) => {
        // Reference to the collection 'myownrecipes' under the user's document
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
            const userDocData = userDocSnap.data();
            if (!userDocData.myownrecipes) {
                userDocData.myownrecipes = [];
            }
            const recipesCollectionRef = collection(userDocRef, 'myownrecipes');
            await addDoc(recipesCollectionRef, {
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                imageUrl: imageUrl.toString(), // Add the imageUrl field here
            });

            // Reference to the collection 'communityrecipes'
            const communityRecipesCollectionRef = collection(db, 'communityrecipes');
            await addDoc(communityRecipesCollectionRef, {
                userName: userDocData.username, // Assuming the user document contains the userName field
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
                imageUrl: imageUrl.toString(), // Add the imageUrl field here
            });
        }
    };


    const uploadImage = async () => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.error(e);
                reject(new TypeError('Network request failed'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', image.uri, true);
            xhr.send(null);
        });
        
        const filename = image.uri.substring(image.uri.lastIndexOf('/') + 1);
        const storageRef = ref(storage, "images/" + filename);
        const uploadTask = uploadBytesResumable(storageRef, blob);
    
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                        case 'paused':
                            console.log('Upload is paused');
                            break;
                        case 'running':
                            console.log('Upload is running');
                            break;
                    }
                },
                (error) => {
                    // A full list of error codes is available at
                    // https://firebase.google.com/docs/storage/web/handle-errors
                    switch (error.code) {
                        case 'storage/unauthorized':
                            // User doesn't have permission to access the object
                            break;
                        case 'storage/canceled':
                            // User canceled the upload
                            break;
                        case 'storage/unknown':
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                },
                () => {
                    // Upload completed successfully, now we can get the download URL
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL); // Resolve promise with download URL
                    }).catch((error) => {
                        reject(error); // Reject promise if getting download URL fails
                    });
                }
            );
        });
    };
    console.log("Here is recipe:", recipe)
    console.log("Here is image uri:",image)

    const handleLaunchCamera = async () => {
        
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            const source = {uri: result.assets[0].uri}
            console.log("Here is source for camera: ",source);
            setImage(source);
        }
    
    const handleLaunchImageLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
        const source = {uri: result.assets[0].uri}
        console.log("Here is source: ", source)
        setImage(source);
    };

    const pickImage = async () => {
        try {
            Alert.alert(
                'Choose Image Source',
                'Would you like to take a photo or choose from the gallery?',
                [
                    {
                        text: 'Take a Photo',
                        onPress: () => handleLaunchCamera(),
                    },
                    {
                        text: 'Choose from Gallery',
                        onPress: () => handleLaunchImageLibrary(),
                    },
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                ]
            );
        } catch (error) {
            console.log('Error picking image:', error);
        }
    };

    const handleIngredientChange = (ingredientName, isChecked) => {
        let updatedIngredients = [...recipe.ingredients];
        if (isChecked) {
            // Add ingredient to the list
            updatedIngredients.push(ingredientName);
        } else {
            // Remove ingredient from the list
            updatedIngredients = updatedIngredients.filter(ingredient => ingredient !== ingredientName);
        }
        setRecipe({
            ...recipe,
            ingredients: updatedIngredients,
        });
    };

    return (
        <ScrollView>
            <View style={Style.container}>
                <Text style={Style.header}>Add Recipe</Text>
                <View style={Style.screenContent}>
                    <View style={Style.addRecipeContent}>
                        {user ? (
                            <>
                                <TextInput
                                    value={recipe.title}
                                    onChangeText={(text) => handleChange('title', text)}
                                    mode='outlined'
                                    style={Style.profileInput}
                                    label={'Enter title'}
                                />
                                <TextInput
                                    value={recipe.ingredients}
                                    onChangeText={(text) => handleChange('ingredients', text)}
                                    multiline={true}
                                    mode='outlined'
                                    style={Style.addRecipeInput}
                                    label={'Enter ingredients'}
                                />
                                <TextInput
                                    value={recipe.instructions}
                                    onChangeText={(text) => handleChange('instructions', text)}
                                    multiline={true}
                                    mode='outlined'
                                    style={Style.addRecipeInput}
                                    label={'Enter instructions'}
                                />
                                {image && <Image source={{ uri: image.uri}} style={{ width: 100, height: 100 }} />}
                                <TouchableOpacity onPress={pickImage} style={Style.addRecipeImageBtn}>
                                    <Text style={Style.profileText}>Select Image</Text>
                                </TouchableOpacity>
                                <Button onPress={handleSubmit} mode='contained' style={Style.addRecipeBtn}>Add recipe</Button>
                            </>
                        ) : (
                            <View>
                                <Text style={[Style.logInOrSignUp, {margin: -10}]}><Text onPress={() => navigation.navigate('Profile')} style={{ color: '#5FD35D'}}> Log in</Text> or <Text onPress={() => navigation.navigate('Profile')} style={{ color: '#5FD35D' }}>Sign up</Text> to add your own recipes</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default AddRecipe;