import React from "react";
import { Modal, View, Text, Image, Button} from "react-native";

const RecipeModal = ({ isVisible, onClose, recipe }) => {
    if (!recipe) {
      return null; // If recipe is null, return null to prevent rendering the modal
    }
  
    return (
      <Modal visible={isVisible} animationType="slide">
        <View>
          {recipe.image && (
            <Image source={{ uri: recipe.image }} style={{ width: 200, height: 200 }} />
          )}
          <Text>{recipe.title}</Text>
          <Text>Ingredients: {recipe.ingredients}</Text>
          <Text>Instructions: {recipe.instructions}</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </Modal>
    );
  };

export default RecipeModal;
