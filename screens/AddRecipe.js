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
import { getStorage, ref, uploadString, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
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
        if (!recipe.title || !recipe.ingredients || !recipe.instructions || !recipe.image) {
            alert('Please fill in all fields');
            return;
        }

        setUploading(true); // Start uploading
        try {
            const imageUrl = await uploadImage(recipe.image);
            await addRecipeToFirestore(imageUrl); // Add recipe to Firestore
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
                imageUrl: imageUrl,
            });
    
            // Reference to the collection 'communityrecipes'
            const communityRecipesCollectionRef = collection(db, 'communityrecipes');
            await addDoc(communityRecipesCollectionRef, {
                userName: userDocData.username, // Assuming the user document contains the userName field
                title: recipe.title,
                ingredients: recipe.ingredients,
                instructions: recipe.instructions,
            });
        }
    };

    const uploadImage = async (imageUri) => {
        const storageRef = ref(storage, `images/${Date.now()}`);
        const snapshot = await uploadBytesResumable(storageRef, imageUri, { contentType: 'image/jpeg' });
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
    };

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
                    // Convert the image URI to Base64
                    const base64Image = await FileSystem.readAsStringAsync(pickedImage.uri, { encoding: FileSystem.EncodingType.Base64 });
                    
                    // Create a data URL
                    const dataUrl = `data:image/jpeg;base64,${base64Image}`;
    
                    setRecipe({
                        ...recipe,
                        image: dataUrl,
                    });
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
                    // Convert the image URI to Base64
                    const base64Image = await FileSystem.readAsStringAsync(pickedImage.uri, { encoding: FileSystem.EncodingType.Base64 });
                    
                    // Create a data URL
                    const dataUrl = `data:image/jpeg;base64,${base64Image}`;
    
                    setRecipe({
                        ...recipe,
                        image: dataUrl,
                    });
                } else {
                    console.log('No URI found in the picked image');
                }
            }
        } catch (error) {
            console.log('Error picking image from library:', error);
        }
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
                                {recipe.image && <Image source={{ uri: recipe.image }} style={{ width: 100, height: 100 }} />}
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