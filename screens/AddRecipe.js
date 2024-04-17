import React, { useState } from 'react';
import { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '../firebase/Config';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Style from '../style/Style';

const AddRecipe = () => {
    const [image, setImage] = useState(null)
    const [recipe, setRecipe] = useState({
        title: '',
        ingredients: '',
        instructions: '',
        image: image,
    });

    const handleChange = (name, value) => {
        setRecipe({
            ...recipe,
            [name]: value,
        });
    };

    const handleImageChange = (result) => {
        console.log("Handling image change with result:", result);
        if (result.assets && result.assets.length > 0 && result.assets[0].uri) {
            setRecipe({
                ...recipe,
                image: result.assets[0].uri,
            });
        } else {
            console.error("Invalid image object");
        }
    };

    const handleSubmit = async () => {
        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                if (recipe.image) {
                    const response = await fetch(recipe.image);
                    const blob = await response.blob();

                    // Upload image to Firebase Storage
                    const imageRef = storage.ref().child(`images/${currentUser.uid}_${Date.now()}.jpg`);
                    await imageRef.put(blob, { contentType: 'image/jpeg' });

                    // Get image URL
                    const imageUrl = await imageRef.getDownloadURL();

                    // Add recipe to 'myownrecipes' collection under the user's UID
                    await db.collection('users').doc(currentUser.uid).collection('myownrecipes').add({
                        ...recipe,
                        image: imageUrl,
                    });

                    alert('Recipe added successfully!');
                    // Clear form
                    setRecipe({
                        title: '',
                        ingredients: '',
                        instructions: '',
                        image: null,
                    });
                } else {
                    alert('Please select an image.');
                }
            } else {
                alert('Please sign in to add a recipe.');
            }
        } catch (error) {
            console.error('Error adding recipe: ', error);
            alert('An error occurred while adding the recipe.');
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                const imagePicked = result.assets[0];
                console.log('Picked Image: ', imagePicked);
                if (imagePicked && imagePicked.uri) {
                    setImage(imagePicked.uri)
                } else {
                    console.log("No URI found in the picked image")
                }
            }
        } catch (error) {
            console.log("error picking image from library", error)
        }
    }


    return (
        <ScrollView>
            <Text style={Style.header}>Add Recipe</Text>
            <View style={{ padding: 20 }}>
                <Text>Title:</Text>
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
                    value={recipe.title}
                    onChangeText={(text) => handleChange('title', text)}
                    placeholder="Enter title"
                />

                <Text>Ingredients:</Text>
                <TextInput
                    style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
                    value={recipe.ingredients}
                    onChangeText={(text) => handleChange('ingredients', text)}
                    multiline={true}
                    placeholder="Enter ingredients"
                />

                <Text>Instructions:</Text>
                <TextInput
                    style={{ height: 100, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
                    value={recipe.instructions}
                    onChangeText={(text) => handleChange('instructions', text)}
                    multiline={true}
                    placeholder="Enter instructions"
                />

                <Text>Image:</Text>
                {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
                <TouchableOpacity onPress={pickImage} style={{ marginBottom: 20 }}>
                    <Text>Select Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ backgroundColor: 'blue', padding: 10, alignItems: 'center', borderRadius: 5 }}
                    onPress={handleSubmit}
                >
                    <Text style={{ color: 'white' }}>Add Recipe</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddRecipe;
