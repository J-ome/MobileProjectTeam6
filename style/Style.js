import { StyleSheet } from "react-native";
import Constants from "expo-constants";
import { MD3LightTheme } from "react-native-paper";

export const MyTheme = {
  ...MD3LightTheme,
  roundness: 5,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#5FD35D',
    onPrimary:'#E4F1E4',
    // onSurfaceVariant: '#5FD35D',
    outline: 'black',
    secondaryContainer: '#5FD35D',
  }
}

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5FD35D'
  },
  statusBar: {
    marginTop: Constants.statusBarHeight + 10
  },
  header: {
    fontSize: 18,
    fontWeight: "bold"

  },
  recipeItem: {
    width: 300,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    alignSelf: 'center'
  },
  recipeContainer: {
    flex: 1, 
    marginTop: 10, 
    marginBottom: 10,
    alignItems: 'center',
  },
  recipeImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  title: {
    fontWeight: 'bold',
    paddingBottom: 20,
    color: '#5FD35D',
    fontSize: 16,
    marginLeft: 20,
    marginTop: 15
  },
  articleItem: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 16,
    elevation: 2,
    // padding: 10,
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
    margin: 20,
    padding: 20,
    // paddingHorizontal: 15,
    alignItems: 'center',
    backgroundColor: '#E4F1E4',
    borderRadius: 13
  },
  articleHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  
  },
  articleImage: {
    width: 80,
    height: 80,
  },
  searchContainer: {
    marginTop: 0,
    paddingHorizontal: 10,
    paddingBottom: 10, 
},
recipeItemContainer:{
  flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20, 
},
goBackIcon: {
  position: 'absolute', 
  top: 20, 
  left: 20, 
}
});
