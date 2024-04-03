
import React from 'react';
import { View, Text, Image } from 'react-native';

const Recipe = ({ route }) => {
  const { recipe } = route.params;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>{recipe.title}</Text>
      <Image source={{ uri: recipe.image }} style={{ width: 200, height: 200, marginBottom: 10 }} />
      <Text>{recipe.fullSummary}</Text>
      <Text>Ready in {recipe.readyInMinutes} minutes</Text>
      {/* Add more details as needed */}
    </View>
  );
};

export default Recipe;