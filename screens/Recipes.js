import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import { db, auth } from "../firebase/Config";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { Divider } from "react-native-paper";
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style';
import RecipeModal from "../components/RecipeModal";
import apiKey from '../apikey';

const stripHtmlTags = (htmlString) => {
  return htmlString.replace(/<[^>]*>/g, '');
};

const Recipes = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const navigation = useNavigation();

  const openModal = async (recipe) => {
    try {
      const imageUrl = await getImageUri(recipe.imageUrl); // Fetch the image URL
      setSelectedRecipe({ ...recipe, imageUrl }); // Pass the entire recipe object along with the imageUrl
      setModalVisible(true);
    } catch (error) {
      console.error('Error fetching image URL:', error);
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedRecipe(null);
    setModalVisible(false);
  };

  const getImageUri = async (imageUrl) => {
    try {
      if (!imageUrl) {
        return null; // Return null if imageUrl is empty or null
      }
      const storage = getStorage();
      // Use the imageUrl directly without any modifications
      const storageRef = ref(storage, imageUrl);
      const url = await getDownloadURL(storageRef);
      return url; // Return the download URL string
    } catch (error) {
      console.error("Getting image error:", error);
      return null;
    }
  };
  const toggleSummary = (index) => {
    const updatedRecipes = [...recipes];
    updatedRecipes[index].summary = updatedRecipes[index].summary === updatedRecipes[index].fullSummary
      ? updatedRecipes[index].summary.slice(0, 150) + '...'
      : updatedRecipes[index].fullSummary;
    setRecipes(updatedRecipes);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const apiUrl = 'https://api.spoonacular.com/recipes/random';
        const numberOfRecipes = 1;

        const response = await axios.get(apiUrl, {
          params: {
            apiKey: apiKey,
            number: numberOfRecipes,
          },
        });

        const recipesWithDetails = await Promise.all(
          response.data.recipes.map(async recipe => {
            // Fetch summary
            const summaryResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/summary`, {
              params: {
                apiKey,
              },
            });
            const summary = stripHtmlTags(summaryResponse.data.summary);

            // Fetch ingredients
            const ingredientsResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/ingredientWidget.json`, {
              params: {
                apiKey,
              },
            });
            const ingredients = ingredientsResponse.data.ingredients.map(ingredient => ingredient.name);

            // Fetch instructions
            const instructionsResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions`, {
              params: {
                apiKey,
              },
            });
            const instructions = instructionsResponse.data[0]?.steps.map(step => step.step);

            // Fetch nutrition details
            const nutritionResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json`, {
              params: {
                apiKey,
              },
            });
            const nutritionDetails = {
              carbs: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Carbohydrates'),
              fat: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Fat'),
              protein: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Protein'),
              kcals: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Calories'),
            };

            return { ...recipe, summary, ingredients, instructions, nutritionDetails, fullSummary: summary,};
          })
        );

        // Limit summary length to 150 characters
        const updatedRecipes = recipesWithDetails.map(recipe => ({
          ...recipe,
          summary: recipe.summary.length > 150 ? recipe.summary.slice(0, 150) + '...' : recipe.summary
        }));

        setRecipes(updatedRecipes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchCommunityRecipes = async () => {
      try {
        const communityRecipesCollectionRef = collection(db, "communityrecipes");
        const communityRecipesSnapshot = await getDocs(communityRecipesCollectionRef);
        const communityRecipesData = communityRecipesSnapshot.docs.map(doc => doc.data());
        setCommunityRecipes(communityRecipesData);
      } catch (error) {
        console.error("Error fetching community recipes: ", error);
      }
    };

    fetchCommunityRecipes();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            <Text style={styles.header}>Recipes</Text>
            <View style={styles.screenContent}>
              {recipes.map((recipe, index) => (
                <TouchableOpacity key={recipe.id} style={{ marginBottom: 10 }} onPress={() => navigation.navigate('Recipe', { recipe })}>
                  <View>
                    <Text style={styles.recipesHeading}>{recipe.title}</Text>
                    <Image source={{ uri: recipe.image }} style={styles.recipesImage} />
                    <Text style={styles.articleText}>{recipe.summary}</Text>
                    {recipe.fullSummary.length > 150 && (
                      <TouchableOpacity onPress={() => toggleSummary(index)}>
                        <Text style={styles.viewMore}>{recipe.summary === recipe.fullSummary ? 'View Less' : 'View More'}</Text>
                      </TouchableOpacity>
                    )}
                    <Text style={styles.readyIn}>Ready in <Text>{recipe.readyInMinutes}</Text> minutes</Text>
                  </View>
                </TouchableOpacity>
              ))}
              <Divider style={styles.divider} />
              <Text style={[styles.title, { color: 'black' }]}>Community Recipes</Text>
              {communityRecipes.map((recipe, index) => (
                <RecipeItem key={index} recipe={recipe} getImageUri={getImageUri} openModal={openModal} />
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <RecipeModal isVisible={modalVisible} onClose={closeModal} recipe={selectedRecipe} />
    </View>
  );
};

const RecipeItem = ({ recipe, getImageUri, openModal }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => {
      try {
        const url = await getImageUri(recipe.imageUrl);
        setImageUrl(url);
      } catch (error) {
        console.error('Error fetching image URL:', error);
      }
    };

    fetchImageUrl();
  }, [recipe.imageUrl]);

  return (
    <TouchableOpacity style={{ marginBottom: 20 }} onPress={() => openModal(recipe)}>
      <View>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{recipe.title}</Text>
        {imageUrl && typeof imageUrl === 'string' && (
          <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200, marginBottom: 10 }} />
        )}
        <Text>{recipe.summary}</Text>
        <Text>Creator: {recipe.userName}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Recipes;
