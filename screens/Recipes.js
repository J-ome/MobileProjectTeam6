import { View, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";


const Recipes = () => {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchRecipes = async () => {
        try {
        const apiKey = "fda60fc993e14793b45bd7cb18f3c8ce";
        const apiUrl = "https://api.spoonacular.com/recipes/random";
        const numberOfRecipes = 10;

        const response = await axios.get(apiUrl, {
            params: {
              apiKey,
              number: numberOfRecipes,
            },
          });
  
          setRecipes(response.data.recipes);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching recipes:', error);
          setLoading(false);
        }
      };
  
      fetchRecipes();
    }, []);

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>Recipes</Text>
          {recipes.map(recipe => (
            <View key={recipe.id} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{recipe.title}</Text>
              <Image source={{ uri: recipe.image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
              <Text>{recipe.summary}</Text>
              <Text>Ready in {recipe.readyInMinutes} minutes</Text>
              {/* Add more details as needed */}
            </View>
          ))}
        </View>
      )}
      </ScrollView>
    </View>
  );
};

export default Recipes;
 