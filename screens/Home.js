import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Linking, Text, ScrollView, Image, StatusBar } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import axios from 'axios';
import styles from '../style/Style';
import apiKey from '../apikey';
import { articlesData } from '../components/Articles';
import { Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Recipe from './Recipe';


const Home = () => {
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
                    carbs: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Carbohydrates'),
                    fat: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Fat'),
                    protein: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Protein'),
                    kcals: nutritionResponse.data.nutrients.find(nutrient => nutrient.name === 'Calories'),
                  };
          
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
            } catch (error) {
              console.error('Error fetching recipes:', error);
            }
          };
          

        fetchRecipesWithDetails();
    }, [searchQuery, numDisplayedRecipes]);



    const fetchRecipes = async () => {
        try {
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
            setRecipes(response.data.results);
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    };




    const handleViewRecipe = (url) => {
        Linking.openURL(url);
    };

    const navigateToRecipe = (recipe) => {
        navigation.navigate('Recipes', { screen: 'Recipe', params: { recipe } });
    };

    const handleSearch = (query) => setSearchQuery(query);

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity style={styles.recipeItem} onPress={() => navigateToRecipe(item)}>
            <Card>
                <Card.Content>
                    <Text style={styles.recipeTitle}>{item.title}</Text>
                </Card.Content>
                <Card.Cover source={{ uri: item.image }} style={styles.recipeImage} />
            </Card>
        </TouchableOpacity>
    );

    const renderArticleItem = ({ item }) => (
        <TouchableOpacity style={styles.articleItem}
            onPress={() => handleViewArticle(item.url)}
        >
            <Card mode='contained'>
                <Card.Content>
                    <Text style={styles.articleTitle}>{item.title}</Text>
                    <Text>{item.content}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    const handleViewArticle1 = (articleId) => {
        navigation.navigate('Article1', { articleId: articleId });
    };

    const handleViewArticle2 = (articleId) => {
        navigation.navigate('Article2', { articleId: articleId });
    };

    const handleViewMore = () => {
        setNumDisplayedRecipes(numDisplayedRecipes + 3);
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#5FD35D'} />
            <ScrollView>
                <View>
                    <Image
                        source={require('../assets/Logo.png')}
                        style={styles.logo} />
                </View>
                <View style={styles.screenContent}>
                    <View style={styles.searchContainer}>
                        <Searchbar
                            placeholder="Search Recipes"
                            onChangeText={handleSearch}
                            value={searchQuery}
                            style={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'black' }}
                        />
                    </View>
                    <Text style={styles.title}>What are you planning to cook today?</Text>
                    <View style={styles.recipeContainer}>
                        {recipes.map((recipe, index) => (
                            <TouchableOpacity key={index} style={styles.recipeItem} onPress={() => navigateToRecipe(recipe)}>
                                <Card mode='contained'>
                                    <Card.Content>
                                        <Text style={styles.recipeTitle}>{recipe.title}</Text>
                                    </Card.Content>
                                    <Card.Cover source={{ uri: recipe.image }} style={styles.recipeImage} />
                                </Card>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={handleViewMore} style={styles.viewMoreButton}>
                            <Text style={styles.viewMoreButtonText}>View More</Text>
                        </TouchableOpacity>
                    </View>
                    <Divider bold={true} style={styles.divider} />
                    <Text style={styles.title}>Articles</Text>
                    <View style={styles.articleContainer}>
                        {/* {articlesData.map((article, index) => (
                    <TouchableOpacity key={index} style={styles.articleItem} onPress={() => handleViewArticle(article.url)}>
                        <Card mode='contained'>
                            <Card.Content>
                                <Text style={styles.articleTitle}>{article.title}</Text>
                                <Text>{article.content}</Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))} */}
                        <TouchableOpacity style={styles.articleCard} onPress={() => handleViewArticle1()}>
                            <Text style={styles.articleCardText}>8 Ways To {"\n"} Cook Eggs</Text>
                            <Image source={require('../assets/eggs.jpg')} style={styles.articleCardImage} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.articleCard} onPress={() => handleViewArticle2()}>
                            <Text style={styles.articleCardText}>How To Use {"\n"} Nuts In {"\n"} Cooking</Text>
                            <Image source={require('../assets/peanut.jpg')} style={styles.articleCardImage} />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};


export default Home;


