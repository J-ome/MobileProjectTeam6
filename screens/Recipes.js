import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from "react-native";
import axios from "axios";
import { db, auth } from "../firebase/Config";
import { collection, getDocs } from "firebase/firestore";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style';

const stripHtmlTags = (htmlString) => {
  return htmlString.replace(/<[^>]*>/g, '');
};

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [communityRecipes, setCommunityRecipes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {


    const fetchRecipes = async () => {
      try {
        const apiKey = '343362399fd04254a4c0c9bd92e35075';
        const apiUrl = 'https://api.spoonacular.com/recipes/random';
        const numberOfRecipes = 1;

        const response = await axios.get(apiUrl, {
          params: {
            apiKey,
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

            return { ...recipe, summary, ingredients, instructions, nutritionDetails, fullSummary: summary };
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
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const recipesCollectionRef = collection(db, `users/${userId}/myownrecipes`);
          const recipesSnapshot = await getDocs(recipesCollectionRef);
          const communityRecipesData = recipesSnapshot.docs.map(doc => doc.data());
          setCommunityRecipes(communityRecipesData);
          console.log("Communityrecipes data: ", communityRecipesData)
        }
      } catch (error) {
        console.error("Error fetching community recipes: ", error);
      }
    };

    fetchCommunityRecipes();
  }, []);

  const toggleSummary = (index) => {
    const updatedRecipes = [...recipes];
    updatedRecipes[index].summary = updatedRecipes[index].summary === updatedRecipes[index].fullSummary
      ? updatedRecipes[index].summary.slice(0, 150) + '...' // Limit to 150 characters
      : updatedRecipes[index].fullSummary;
    setRecipes(updatedRecipes);
  };

  const navigateToRecipe = (recipe) => {
    console.log("Navigating to Recipe:", recipe);
    navigation.navigate('Recipe', { recipe });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Recipes</Text>
            {recipes.map((recipe, index) => (
              <TouchableOpacity key={recipe.id} style={{ marginBottom: 20 }} onPress={() => navigateToRecipe(recipe)}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{recipe.title}</Text>
                  <Image source={{ uri: recipe.image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
                  <Text>{recipe.summary}</Text>
                  {recipe.fullSummary.length > 150 && (
                    <TouchableOpacity onPress={() => toggleSummary(index)}>
                      <Text style={{ color: 'blue' }}>{recipe.summary === recipe.fullSummary ? 'View Less' : 'View More'}</Text>
                    </TouchableOpacity>
                  )}
                  <Text>Ready in {recipe.readyInMinutes} minutes</Text>

                  {/* Display nutrition details */}
                  <View style={{ marginTop: 10 }}>
                    <Text>Carbs: {recipe.nutritionDetails.carbs.amount} {recipe.nutritionDetails.carbs.unit}</Text>
                    <Text>Fat: {recipe.nutritionDetails.fat.amount} {recipe.nutritionDetails.fat.unit}</Text>
                    <Text>Protein: {recipe.nutritionDetails.protein.amount} {recipe.nutritionDetails.protein.unit}</Text>
                    <Text>Kcals: {recipe.nutritionDetails.kcals.amount} {recipe.nutritionDetails.kcals.unit}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Community Recipes</Text>
            {communityRecipes.map((recipe, index) => (
              <TouchableOpacity key={index} style={{ marginBottom: 20 }} onPress={() => navigateToRecipe(recipe)}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{recipe.title}</Text>
                  <Image source={{ uri: recipe.image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
                  <Text>Ingredients: {recipe.ingredients}</Text>
                  <Text>Instructions: {recipe.instructions}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Recipes;
