import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import { db } from '../firebase/Config';
import { doc, collection, setDoc, deleteDoc, getDoc, addDoc } from 'firebase/firestore';
import { useAuth } from '../components/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import styles from '../style/Style';
import DonutChart from '../components/DonutChart';

const Recipe = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation();
  const favoritesCollection = collection(db, 'favorites');
  const {user} = useAuth();

  useEffect(() => {
    checkFavoriteStatus();
  }, []);

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
    { name: 'Carbs', number: Math.round(recipe.nutritionDetails?.carbs?.amount || 0), color: 'green' },
    { name: 'Protein', number: Math.round(recipe.nutritionDetails?.protein?.amount || 0), color: 'lightpink' },
    { name: 'Fats', number: Math.round(recipe.nutritionDetails?.fat?.amount || 0), color: 'wheat' },
  ];
  const [isFavorite, setIsFavorite] = useState(false);


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
    <SafeAreaView style={{flex: 1}}>
      <ScrollView>
    <View style={styles.recipeItemContainer}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{recipe.title}</Text>
      <Image source={{ uri: recipe.image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
            {/* Display heart icon based on whether recipe is in favorites */}
            <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteIcon}>
        {isFavorite ? (
          <MaterialCommunityIcons name="heart" size={24} color="black" />
        ) : (
          <MaterialCommunityIcons name="heart-outline" size={24} color="black" />
        )}
      </TouchableOpacity>
      <Text>Add to favorites</Text>
      <Text>Ready in {recipe.readyInMinutes} minutes</Text>
      <Text>Nutrition:</Text>
      <View style={{ marginLeft: 10 }}>
        <Text>Carbs: {recipe.nutritionDetails?.carbs?.amount || 0} {recipe.nutritionDetails?.carbs?.unit || ''}</Text>
        <Text>Protein: {recipe.nutritionDetails?.protein?.amount || 0} {recipe.nutritionDetails?.protein?.unit || ''}</Text>
        <Text>Fats: {recipe.nutritionDetails?.fat?.amount || 0} {recipe.nutritionDetails?.fat?.unit || ''}</Text>
        <Text>Kcals: {recipe.nutritionDetails?.kcals?.amount || 0} {recipe.nutritionDetails?.kcals?.unit || ''}</Text>
      </View>
      <DonutChart data={donutChartData} />
      <Text>Ingredients:</Text>
      <FlatList
        data={recipe.extendedIngredients || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={{ marginLeft: 10 }}>{`${item.amount} ${item.unit} ${item.name}`}</Text>
        )}
      />

      <Text>Instructions:</Text>
      <FlatList
        data={recipe.instructions || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <Text style={{ marginLeft: 10 }}>{`${index + 1}. ${item}`}</Text>
        )}
      />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackIcon}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

export default Recipe;
