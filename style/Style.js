import { StyleSheet } from "react-native";
import Constants from "expo-constants";


export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBar: {
    marginTop: Constants.statusBarHeight + 10
  },
  recipeItem: {
    width: 200, 
    marginBottom: 15,
    borderRadius: 10,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  recipeTitle: {
    fontWeight: 'bold', 
    textAlign: 'center',
  }
  });