import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, SafeAreaView, Switch } from 'react-native';
import { db } from '../firebase/Config';
import { doc, collection, setDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../style/Style';
import DonutChart from '../components/DonutChart';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import FullWidthImage from 'react-native-fullwidth-image';
import axios from 'axios'; // Import axios library
import apiKey from '../apikey';

const Recipe = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation();
  const favoritesCollection = collection(db, 'favorites');
  const { user } = useAuth();

  const [allIngredients, setAllIngredients] = useState([]); // State to hold all ingredient details
  const [unitSystem, setUnitSystem] = useState('metric');

  useEffect(() => {
    fetchIngredientDetails(); // Fetch ingredient details when component mounts
    checkFavoriteStatus();
  }, [recipe]); // Re-fetch ingredients when recipe changes

  useEffect(() => {
    fetchIngredientDetails(); // Re-fetch ingredients when unit system changes
  }, [unitSystem]);

  const fetchIngredientDetails = async () => {
    try {
      // Check if ingredients with the current unit system have already been fetched
      const ingredientsExist = allIngredients.some(ingredient => ingredient.unit === unitSystem);
  
      if (!ingredientsExist) {
        const ingredientsResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/ingredientWidget.json`, {
          params: {
            apiKey,
            unit: unitSystem
          },
        });
  
        const ingredients = ingredientsResponse.data.ingredients.map(ingredient => ({
          amount: ingredient.amount[unitSystem]?.value || 0, // Use selected unit system for amounts
          unit: ingredient.amount[unitSystem]?.unit || '',
          name: ingredient.name,
        }));
  
        setAllIngredients(ingredients);
      }
    } catch (error) {
      console.error('Error fetching ingredient details:', error);
    }
  };
  const toggleUnitSystem = () => {
    const newUnitSystem = unitSystem === 'us' ? 'metric' : 'us'; // Toggle between US and Metric
    setUnitSystem(newUnitSystem);
  };


  const checkFavoriteStatus = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const favoritesCollectionRef = collection(userDocRef, 'favorites');
      const recipeDocRef = doc(favoritesCollectionRef, recipe.id.toString());

      const recipeSnapshot = await getDoc(recipeDocRef);
      setIsFavorite(recipeSnapshot.exists());
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const favoritesCollectionRef = collection(userDocRef, 'favorites');
      const recipeDocRef = doc(favoritesCollectionRef, recipe.id.toString());

      if (isFavorite) {
        await deleteDoc(recipeDocRef);
      } else {
        await setDoc(recipeDocRef, recipe);
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Error toggling favorite status:', error);
    }
  };

  const addFavoriteRecipe = async (recipe) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const favoritesCollectionRef = collection(userDocRef, 'favorites');
      const recipeDocRef = doc(favoritesCollectionRef, recipe.id.toString());

      const recipeSnapshot = await getDoc(recipeDocRef);
      if (!recipeSnapshot.exists()) {
        await setDoc(recipeDocRef, recipe);
        console.log('Recipe added to favorites:', recipe);
      } else {
        console.log('Recipe already exists in favorites.');
      }
    } catch (error) {
      console.error('Error adding recipe to favorites:', error);
    }
  };

  // Prepare data for the donut chart
  const donutChartData = [
    { number: Math.round(recipe.nutritionDetails?.carbs?.amount || 0), color: 'green' },
    { number: Math.round(recipe.nutritionDetails?.protein?.amount || 0), color: 'lightpink' },
    { number: Math.round(recipe.nutritionDetails?.fat?.amount || 0), color: 'wheat' },
  ];
  const [isFavorite, setIsFavorite] = useState(false);
  const totalCalories = Math.round(recipe.nutritionDetails.kcals?.amount || 0);

  if (!recipe) {
    return (
      <View style={styles.recipeItemContainer}>
        <Text>No recipe details available</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackIcon}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackIcon}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
      <GestureHandlerRootView>
        <FlatList
          data={[{ key: 'content' }]}
          renderItem={({ item }) => (
            <View style={[styles.screenContent, { paddingTop: 0 }]}>
              <FullWidthImage source={{ uri: recipe.image }} style={styles.recipeImage} />
              <View style={styles.recipeScreenTitle}>
                <Text>{recipe.title}</Text>
              </View>

              {/* Display heart icon based on whether recipe is in favorites */}
              <View style={styles.recipeAddToFavorites}>
                <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteIcon}>
                  {isFavorite ? (
                    <MaterialCommunityIcons name="heart" size={24} color="black" />
                  ) : (
                    <MaterialCommunityIcons name="heart-outline" size={24} color="black" />
                  )}
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold' }}>Add to favorites</Text>
              </View>

              <View style={styles.recipeItemContainer}>
                <Text style={styles.readyIn}>Ready in {recipe.readyInMinutes} minutes</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Switch
                    trackColor={{ false: '#E4F1E4', true: '#5FD35D' }}
                    thumbColor={unitSystem === 'metric' ? "#f4f3f4" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleUnitSystem}
                    value={unitSystem === 'metric'}
                  />
                  <Text style={{ marginLeft: 10 }}>{unitSystem === 'metric' ? 'Metric' : 'US'}</Text>
                </View>

                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Ingredients:</Text>
                <FlatList
                  data={allIngredients || []}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => {
                    return (
                      <Text style={{ marginBottom: 5, fontSize: 16 }}>
                        {/* Display ingredient amounts based on selected unit system */}
                        {`${item.amount} ${item.unit} ${item.name}`}
                      </Text>
                    );
                  }}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginTop: 20 }}>Instructions:</Text>
                <FlatList
                  data={recipe.instructions || []}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <Text style={{ marginHorizontal: 20, fontSize: 16, marginBottom: 5 }}>{`${index + 1}. ${item}`}</Text>
                  )}
                />
                <DonutChart data={donutChartData} centerLabel={`${totalCalories} kcal`} />
                <View style={{ marginLeft: 10, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'green', marginRight: 5 }}></View>
                  <Text>Carbs: {recipe.nutritionDetails?.carbs?.amount || 0} {recipe.nutritionDetails?.carbs?.unit || ''}</Text>
                </View>
                <View style={{ marginLeft: 10, marginBottom: 20, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'lightpink', marginRight: 5 }}></View>
                  <Text>Protein: {recipe.nutritionDetails?.protein?.amount || 0} {recipe.nutritionDetails?.protein?.unit || ''}</Text>
                </View>
                <View style={{ marginLeft: 10, marginBottom: 40, flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: 'wheat', marginRight: 5 }}></View>
                  <Text>Fats: {recipe.nutritionDetails?.fat?.amount || 0} {recipe.nutritionDetails?.fat?.unit || ''}</Text>
                </View>
              </View>
            </View>
          )}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );

};

export default Recipe;
