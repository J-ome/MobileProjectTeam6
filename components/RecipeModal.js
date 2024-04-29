import React from "react";
import { Modal, View, Text, Image, Button, TouchableOpacity} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style'

const RecipeModal = ({ isVisible, onClose, recipe }) => {
    if (!recipe) {
      return null; // If recipe is null, return null to prevent rendering the modal
    }
  
    return (
      <Modal visible={isVisible} animationType="slide">
        <View style={styles.container}>
          <TouchableOpacity onPress={() => onClose()} style={styles.goBackIcon}>
            <Ionicons name="chevron-back-outline" size={24} color="black" />
          </TouchableOpacity>
          <View style={styles.screenContent}>
          {recipe.image && (
            <Image source={{ uri: recipe.image }} style={{ width: 200, height: 200 }} />
          )}
          <Text style={styles.recipesHeading}>{recipe.title}</Text>
          <Text>Ingredients: {recipe.ingredients}</Text>
          <Text>Instructions: {recipe.instructions}</Text>
          {/* <Button title="Close" onPress={onClose} /> */}
        </View>
        </View>
      </Modal>
    );
  };

export default RecipeModal;
