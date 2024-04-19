import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style';
import DonutChart from '../components/DonutChart';

const Recipe = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation();

  // Prepare data for the donut chart
  const donutChartData = [
    { name: 'Carbs', number: Math.round(recipe.nutritionDetails?.carbs?.amount || 0), color: 'green' },
    { name: 'Protein', number: Math.round(recipe.nutritionDetails?.protein?.amount || 0), color: 'lightpink' },
    { name: 'Fats', number: Math.round(recipe.nutritionDetails?.fat?.amount || 0), color: 'wheat' },
  ];

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
    <View style={styles.recipeItemContainer}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{recipe.title}</Text>
      <Image source={{ uri: recipe.image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
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
  );
};

export default Recipe;
