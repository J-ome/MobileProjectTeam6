import React, { useState, useEffect} from 'react';
import { useNavigation } from "@react-navigation/native";
import { doc, collection, addDoc,} from 'firebase/firestore';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import {auth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/Config';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../components/AuthContext';
import Style from '../style/Style';

const AddRecipe = () => {
    const { user } = useAuth(); // Access current user from AuthContext
    const [recipe, setRecipe] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        image: '',
    });
    const navigation = useNavigation();


    const handleChange = (name, value) => {
        setRecipe({
            ...recipe,
            [name]: value,
        });
    };

    const handleSubmit = async () => {
        try {
            if (!user) {
                alert('Please sign in to add a recipe.');
                return;
            }
    
            const { title, ingredients, instructions, image } = recipe;
            if (!title || !ingredients || !instructions || !image) {
                console.log('Recipe:', recipe);
                console.log('Title:', title);
                console.log('Ingredients:', ingredients);
                console.log('Instructions:', instructions);
                console.log('Image:', image);
                alert('Please fill in all fields');
                return;
            }
    
            // Reference to the collection 'myownrecipes' under the user's document
            const userDocRef = doc(db, 'users', user.uid);
            const recipesCollectionRef = collection(userDocRef, 'myownrecipes');
    
            // Add recipe to 'myownrecipes' collection under the user's UID
            await addDoc(recipesCollectionRef, {
                title: title,
                ingredients: ingredients,
                instructions: instructions,
                image: image,
            });
    
            alert('Recipe added successfully!');
            // Clear form
            setRecipe({
                title: '',
                ingredients: '',
                instructions: '',
                image: null,
            });
        } catch (error) {
            console.error('Error adding recipe: ', error);
            alert('An error occurred while adding the recipe.');
        }
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
                    setRecipe({
                        ...recipe,
                        image: pickedImage.uri,
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
                    setRecipe({
                        ...recipe,
                        image: pickedImage.uri,
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
            <Text style={Style.header}>Add Recipe</Text>
            <View style={{ padding: 20 }}>
                {/* Title */}
                <Text>Title:</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
                    value={recipe.title}
                    onChangeText={(text) => handleChange('title', text)}
                    placeholder="Enter title"
                />

                {/* Ingredients */}
                <Text>Ingredients:</Text>
                <TextInput
                    style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
                    value={recipe.ingredients}
                    onChangeText={(text) => handleChange('ingredients', text)}
                    multiline={true}
                    placeholder="Enter ingredients"
                />

                {/* Instructions */}
                <Text>Instructions:</Text>
                <TextInput
                    style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
                    value={recipe.instructions}
                    onChangeText={(text) => handleChange('instructions', text)}
                    multiline={true}
                    placeholder="Enter instructions"
                />

                {/* Image */}
                <Text>Image:</Text>
                {recipe.image && <Image source={{ uri: recipe.image }} style={{ width: 100, height: 100 }} />}
                <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
                    <Text>Select Image</Text>
                </TouchableOpacity>

                {/* Add Recipe Button */}
                <TouchableOpacity
                    style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 5 }}
                    onPress={handleSubmit}
                >
                    <Text style={{ color: 'white' }}>Add Recipe</Text>
                </TouchableOpacity>
                
                {/* Conditional rendering for not logged in users */}
                {!user && (
                    <View style={{marginTop: 20}}>
                        <Text style={{ marginTop: 5 }}><Text onPress={() => navigation.navigate('Profile')} style={{ color: 'blue'}}> Log in</Text> or <Text onPress={() => navigation.navigate('Profile')} style={{ color: 'blue' }}>Sign up</Text> to add your own recipes</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default AddRecipe;