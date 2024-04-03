import { StyleSheet } from "react-native";
import Constants from "expo-constants";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
   recipeContainer: {
    flex: 1, 
    marginTop: 10, 
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  recipeTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  articleItem: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#f9f9f9',
    padding: 10,
  },
  articleTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  articleContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  articleContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'black',
  },
  articleHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingBottom: 10, 
},
});
