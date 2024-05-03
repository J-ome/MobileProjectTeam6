import React from "react";
import { Modal, View, Text, Image, Button, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style'
import FullWidthImage from 'react-native-fullwidth-image';
import { ScrollView } from "react-native-gesture-handler";

const RecipeModal = ({ isVisible, onClose, recipe, }) => {
  if (!recipe) {
    return null; // If recipe is null, return null to prevent rendering the modal
  }

  return (
    <Modal visible={isVisible}
    // animationType="slide"
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => onClose()} style={styles.goBackIcon}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView>
          <View style={[styles.screenContent, { paddingTop: 0 }]}>
            {recipe.imageUrl && ( // Check if the imageUrl property exists in the recipe object
              <FullWidthImage source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />
            )}
            <View style={styles.recipeScreenTitle}>
              <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{recipe.title}</Text>
            </View>
            <View style={styles.recipeItemContainer}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Ingredients:</Text>
              <Text style={styles.modalText}>{recipe.ingredients}</Text>
              <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10, marginTop: 20 }}>Instructions:</Text>
              <Text style={styles.modalText}>{recipe.instructions}</Text>
            </View>
            <Text style={[styles.articleText, { fontWeight: '500', marginTop: 20, marginLeft: 20 }]}>Creator: <Text style={styles.creator}>{recipe.userName}</Text></Text>
          </View>
        </ScrollView>
      </View>

    </Modal>
  );
};

export default RecipeModal;
