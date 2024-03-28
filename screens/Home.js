import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableOpacity, Linking, Text } from 'react-native';
import { Card } from 'react-native-paper';
import axios from 'axios';
import styles from '../style/Style';
import apiKey from '../apikey';
import { articlesData } from '../components/Articles';

const Home = () => {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        const fetchRecipeInformation = async () => {
            try {
                const apiKey = "fda60fc993e14793b45bd7cb18f3c8ce";
                const response = await axios.get(
                    'https://api.spoonacular.com/recipes/informationBulk',
                    {
                        params: {
                            ids: '715538,716429',
                            apiKey: apiKey,
                        },
                    }
                );
                setRecipes(response.data);
            } catch (error) {
                console.error('Error fetching recipe information:', error);
            }
        };

        fetchRecipeInformation();
    }, []);

    const handleViewRecipe = (url) => {
        Linking.openURL(url);
    };

    const renderRecipeItem = ({ item }) => (
        <TouchableOpacity style={styles.recipeItem} onPress={() => handleViewRecipe(item.spoonacularSourceUrl)}>
            <Card>
                <Card.Content>
                    <Text style={styles.recipeTitle}>{item.title}</Text>
                </Card.Content>
                <Card.Cover source={{ uri: item.image }} style={styles.recipeImage} />
            </Card>
        </TouchableOpacity>
    );

    const renderArticleItem = ({ item }) => (
        <TouchableOpacity style={styles.articleItem} onPress={() => handleViewArticle(item.url)}>
            <Card>
                <Card.Content>
                    <Text style={styles.articleTitle}>{item.title}</Text>
                    <Text>{item.content}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.recipeContainer}>
                <Text style={styles.recipeTitle}>Recipes</Text>
                <FlatList
                    data={recipes}
                    renderItem={renderRecipeItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                />
            </View>
            <View style={styles.articleContainer}>
                <Text style={styles.articleHeading}>Articles</Text>
                <FlatList
                    data={articlesData} 
                    renderItem={renderArticleItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
        </View>
    );
};

export default Home;