import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/Config";
import { collection, getDocs } from "firebase/firestore";
import Style from "../style/Style";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import axios from "axios";
import apiKey from "../apikey";

const Favorites = () => {
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSummaries, setExpandedSummaries] = useState({}); // Keep track of expanded summaries
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [numDisplayedRecipes, setNumDisplayedRecipes] = useState(3);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipesWithDetails = async () => {
      try {
        // Fetch recipes
        const response = await axios.get(
          'https://api.spoonacular.com/recipes/complexSearch',
          {
            params: {
              query: searchQuery,
              number: numDisplayedRecipes,
              apiKey: apiKey,
            },
          }
        );

        // Map over each recipe and fetch details
        const recipesWithDetails = await Promise.all(
          response.data.results.map(async (recipe) => {
            // Fetch ingredients
            const ingredientsResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/ingredientWidget.json`, {
              params: {
                apiKey,
              },

            });
            const detailsResponse = await axios.get(
              `https://api.spoonacular.com/recipes/${recipe.id}/information`,
              {
                params: {
                  includeNutrition: false,
                  apiKey: apiKey,
                },
              }
            );
            const details = detailsResponse.data;

            const ingredients = ingredientsResponse.data.ingredients.map(ingredient => ({
              amount: ingredient.amount?.metric?.value || 0,
              unit: ingredient.amount?.metric?.unit || '',
              name: ingredient.name,
            }));

            // Fetch instructions
            const instructionsResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/analyzedInstructions`, {
              params: {
                apiKey,
              },
            });
            const instructions = instructionsResponse.data[0]?.steps.map(step => step.step) || [];

            // Fetch nutrition details
            const nutritionResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/nutritionWidget.json`, {
              params: {
                apiKey,
              },
            });
            const nutritionDetails = {
              carbs: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Carbohydrates') || { amount: 0 }, // Adjust default values as needed
              fat: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Fat') || { amount: 0 },
              protein: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Protein') || { amount: 0 },
              kcals: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Calories') || { amount: 0 },
            };
            console.log(nutritionDetails); // Log nutrition details to verify the structure
            return {
              ...recipe,
              ingredients,
              instructions,
              nutritionDetails,
              readyInMinutes: details.readyInMinutes,
            };
          })
        );
        setRecipes(recipesWithDetails); // Update this line
        console.log("Recipe data " + recipesWithDetails.data);

      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };


    fetchRecipesWithDetails();
  }, [searchQuery, numDisplayedRecipes]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const favoritesCollectionRef = collection(db, `users/${userId}/favorites`);
          const favoritesSnapshot = await getDocs(favoritesCollectionRef);
          const favoritesData = favoritesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserFavorites(favoritesData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites: ", error);
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const toggleExpandedSummary = (id) => {
    setExpandedSummaries((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderSummary = (summary, id) => {
    const maxLength = 150;
    const isExpanded = expandedSummaries[id] || false;

    if (!summary || typeof summary !== 'string') {
      return null; // Return null if summary is undefined or not a string
    }

    if (isExpanded || summary.length <= maxLength) {
      return (
        <>
          {summary}
          {isExpanded && (
            <TouchableOpacity onPress={() => toggleExpandedSummary(id)}>
              <Text style={Style.viewMore}> View less</Text>
            </TouchableOpacity>
          )}
        </>
      );
    } else {
      const truncatedSummary = summary.substring(0, maxLength);
      return (
        <>
          {truncatedSummary}
          <TouchableOpacity onPress={() => toggleExpandedSummary(id)}>
            <Text style={Style.viewMore}> View more</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  const navigateToRecipe = (item) => {
    // Navigate to the recipe screen with the specified recipeId
    navigation.navigate('Recipes', { screen: 'Recipe', params: { recipe: item } });
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (auth.currentUser) {
      if (userFavorites.length === 0) {
        return (
          <View style={{ backgroundColor: '#5FD35D' }}>
            <Text style={Style.header}>Favorites</Text>
            <View style={Style.screenContentFavorites}>
              <Text style={Style.logInOrSignUp}>You have no favorites yet</Text>
            </View>
          </View>
        );
      } else {
        return (
          <View style={{ backgroundColor: '#5FD35D' }}>
            <Text style={Style.header}>Favorites</Text>
            <View style={Style.screenContentFavorites}>
              <GestureHandlerRootView>
                <FlatList
                  data={userFavorites}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View>
                      <TouchableOpacity onPress={() => navigateToRecipe(item)}>
                        <Text style={Style.recipesHeading}>{item.title}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => navigateToRecipe(item)}>
                        <Image source={{ uri: item.image }} style={Style.recipesImage} />
                      </TouchableOpacity>
                      <Text style={Style.articleText}>{renderSummary(item.fullSummary, item.id)}</Text>
                    </View>
                  )}
                />
              </GestureHandlerRootView>
            </View>
          </View>
        );
      }
    } else {
      return (
        <View style={{ backgroundColor: '#5FD35D' }}>
          <Text style={Style.header}>Favorites</Text>
          <View style={Style.screenContentFavorites}>
            <Text style={Style.logInOrSignUp}><Text onPress={() => navigation.navigate('Profile')} style={{ color: '#5FD35D' }}> Log in</Text> or <Text onPress={() => navigation.navigate('Profile')} style={{ color: '#5FD35D' }}>Sign up</Text> to view your favorites</Text>
          </View>
        </View>
      );
    }
  };

  return <View>{renderContent()}</View>;
};

export default Favorites;
