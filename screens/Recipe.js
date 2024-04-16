import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style';

const Recipe = ({ route }) => {
  const { recipe } = route.params;
  const navigation = useNavigation(); 

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
      <Text>{recipe.fullSummary}</Text>
      <Text>Ready in {recipe.readyInMinutes} minutes</Text>
      
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackIcon}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default Recipe;
