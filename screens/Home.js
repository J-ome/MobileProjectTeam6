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
        fetchRecipes();
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
            <Card>
                <Card.Content>
                    <Text style={styles.articleTitle}>{item.title}</Text>
                    <Text>{item.content}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    const handleViewMore = () => {
        setNumDisplayedRecipes(numDisplayedRecipes + 3); 
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={'#5FD35D'} />
            <ScrollView>
            <View>
                <Image
                    source={require('../assets/Ellipse1.png')}
                    style={styles.logo} />
            </View>
            <View style={styles.homeContent}>
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search Recipes"
                    onChangeText={handleSearch}
                    value={searchQuery}
                    style={{ backgroundColor: 'white', borderWidth: 1, borderColor: 'black' }}
                />
            </View>
            <Text style={styles.recipeTitle}>What are you planning to cook today?</Text>
            <View style={styles.recipeContainer}>
                {recipes.map((recipe, index) => (
                    <TouchableOpacity key={index} style={styles.recipeItem} onPress={() => navigateToRecipe(recipe)}>
                        <Card>
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
            <Text style={styles.recipeTitle}>Articles</Text>
            <View style={styles.articleContainer}>
                {articlesData.map((article, index) => (
                    <TouchableOpacity key={index} style={styles.articleItem} onPress={() => handleViewArticle(article.url)}>
                        <Card>
                            <Card.Content>
                                <Text style={styles.articleTitle}>{article.title}</Text>
                                <Text>{article.content}</Text>
                            </Card.Content>
                        </Card>
                    </TouchableOpacity>
                ))}
            </View>
            </View>
            </ScrollView>
        </View>
    );
};


export default Home;


