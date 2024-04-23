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
    // onSurfaceVariant: '#b73a9e',
    outline: 'black',
    secondaryContainer: '#5FD35D',
    surfaceVariant: '#E4F1E4'
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
    fontWeight: "bold",
    paddingHorizontal: 30,
    paddingTop: 20
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
    marginTop: 15,
  },
  recipeTitle: {
    fontWeight: 'bold',
    color: '#645e5e',
    paddingBottom: 13
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
  },
  screenContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    marginTop: 20,
    paddingBottom: 50
  },
  logo: {
    alignSelf: 'center'
  },
  divider: {
    marginHorizontal: 50,
    marginVertical: 20,
    borderBottomWidth: 1
  },
  btn: {
    marginBottom: 20,
    marginTop: 10,
    marginHorizontal: 50
  },
  textInput: {
    // marginHorizontal: 40,
    marginBottom: 10,
    alignSelf: 'center',
    width: 300,
  },
  profileContent: {
    // paddingLeft: 30,
    gap: 10,
    justifyContent: 'center'
  },
  profileImageBtn: {
    backgroundColor: '#E4F1E4',
    borderRadius: 20,
    padding: 12,
  },
  profileText: {
    fontWeight: '500',
    textAlign: 'center'
  },
  profileImageContent: {
    alignItems: 'center',
    gap: 30,
    marginBottom: 40
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 60
  },
  profileInput: {
    width: 300
  },
  save: {
    backgroundColor: '#E4F1E4',
    borderRadius: 20,
    padding: 12,
    width: 100,
    marginTop: 18
  },
  saveText: {
    textAlign: "center",
    fontWeight: '500'
  },
  logoutDelete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 30,
    marginTop: 30
  },
  profileBtn: {
    backgroundColor: 'orange',
    fontSize: 20,
    padding: 0
  },
  addRecipeContent: {
    padding: 20,
    gap: 15,
    alignItems: 'center'
  },
  addRecipeInput: {
    height: 100,
    width: 300
  },
  addRecipeImageBtn: {
    backgroundColor: '#E4F1E4',
    borderRadius: 20,
    padding: 12,
    width: 200,
    // borderColor: '#5FD35D',
    // borderWidth: 2
  },
  addRecipeBtn: {
    marginTop: 40
  }
});
