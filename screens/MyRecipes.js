import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, Image, TouchableOpacity, Alert } from "react-native";
import { db, auth } from "../firebase/Config";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { getStorage, ref } from 'firebase/storage';

import Style from "../style/Style";

const MyRecipe = () => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  
  const storage = getStorage();
  const storageRef = ref(storage);
  const imagesRef = ref(storage, 'images');
  const spaceRef = ref(imagesRef, fileName);
  const path = spaceRef.fullPath;
  const name = spaceRef.name;
  const imagesRefAgain = spaceRef.parent;

  useEffect(() => {
    const fetchOwnRecipes = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const recipesCollectionRef = collection(db, `users/${userId}/myownrecipes`);
          const recipesSnapshot = await getDocs(recipesCollectionRef);
          const recipesData = recipesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserRecipes(recipesData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user recipes: ", error);
        setLoading(false);
      }
    };

    fetchOwnRecipes();
  }, []);



  const handleDeleteRecipe = async (recipeId) => {
    try {
      await deleteDoc(doc(db, `users/${auth.currentUser.uid}/myownrecipes`, recipeId));
      // Filter out the deleted recipe from the userRecipes state
      setUserRecipes(userRecipes.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe: ", error);
    }
  };

  const confirmDeleteRecipe = (recipeId) => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "Delete", onPress: () => handleDeleteRecipe(recipeId) },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={Style.goBackIcon}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 10 }}>My Recipes</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : userRecipes.length > 0 ? (
        <FlatList
          data={userRecipes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>{item.title}</Text>
              <Image source={{ uri: item.image }} style={{ width: 200, height: 200, marginBottom: 5 }} />
              <Text style={{ marginBottom: 5 }}>Ingredients: {item.ingredients}</Text>
              <Text>Instructions: {item.instructions}</Text>
              <TouchableOpacity onPress={() => confirmDeleteRecipe(item.id)}>
                <Text style={{ color: "red", marginTop: 5 }}>Delete Recipe</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>You have not created your own recipes yet.</Text>
          <Text style={{ fontSize: 16, marginBottom: 10 }}>Create your own recipes at <Text onPress={() => navigation.navigate("AddRecipe")} style={{ fontSize: 16, marginBottom: 10, color: "blue" }}>Add Recipe</Text></Text> 

 
        </View>
      )}
    </View>
  );
};

export default MyRecipe;