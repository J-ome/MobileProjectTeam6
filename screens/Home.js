import React, { useEffect, useState } from 'react';
import { FlatList, View, TouchableOpacity, Linking, Text } from 'react-native';
import { Card } from 'react-native-paper';
import axios from 'axios';
import styles from '../style/Style';
import apiKey from '../firebase/Config';

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

    return (
        <View style={styles.container}>
            <FlatList
                data={recipes}
                renderItem={renderRecipeItem}
                keyExtractor={(item) => item.id.toString()}
                horizontal
            />
        </View>
    );
};

export default Home;
