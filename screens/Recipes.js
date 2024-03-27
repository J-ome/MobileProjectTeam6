import { View } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";


export default Recipes = () => {

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchRecipes = async () => {
        try {
        const apiKey = "";
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
        <div>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              <h2>Recipes</h2>
              <ul>
                {recipes.map(recipe => (
                  <li key={recipe.id}>
                    <h3>{recipe.title}</h3>
                    <img src={recipe.image} alt={recipe.title} />
                    <p>{recipe.summary}</p>
                    <p>Ready in {recipe.readyInMinutes} minutes</p>
                    {/* Add more details as needed */}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      );
    };

 