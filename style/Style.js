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
    backgroundColor: '#5FD35D',
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
  // recipeImage: {
  //   width: '100%',
  //   height: 150,
  //   resizeMode: 'cover',
  // },
  title: {
    fontWeight: 'bold',
    paddingBottom: 20,
    color: '#5FD35D',
    fontSize: 18,
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
  // articleTitle: {
  //   fontWeight: 'bold',
  //   fontSize: 16,
  //   marginBottom: 5,
  // },
  articleContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  articleContainer: {
    flex: 1,
    margin: 20,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#E4F1E4',
    borderRadius: 13,
    gap: 20
  },
  // articleHeading: {
  //   fontSize: 20,
  //   fontWeight: 'bold',
  //   marginBottom: 10,
  
  // },
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
    // position: 'absolute', 
    top: 20, 
    left: 20, 
    marginBottom: 20
  },
  screenContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    marginTop: 20,
    paddingBottom: 100
  },
  logo: {
    alignSelf: 'center',
    margin: 20
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
    // justifyContent: 'center',
    marginHorizontal: 20
  },
  profileImageBtn: {
    backgroundColor: '#E4F1E4',
    borderRadius: 20,
    padding: 12,
  },
  profileText: {
    fontWeight: '500',
    // textAlign: 'center',
    marginLeft: 20
  },
  profileImageText: {
    textAlign: 'center',
    fontWeight: '500'
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
    width: 300,
    alignSelf: 'center'
  },
  save: {
    backgroundColor: '#E4F1E4',
    borderRadius: 20,
    padding: 12,
    width: 100,
    marginTop: 18,
    alignSelf: 'center',
    marginBottom: 20
  },
  saveText: {
    textAlign: "center",
    fontWeight: '500'
  },
  logoutDelete: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
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
  },
  articleHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5FD35D',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20
  },
  articleTitle: {
    fontWeight: 'bold',
    marginHorizontal: 20
  },
  articleText: {
    marginHorizontal: 20,
    marginBottom: 15,
  }, 
  articleImage: {
    width: 300,
    height: 170,
    alignSelf: 'center',
    borderRadius: 20,
    marginBottom: 20
  },
  articleCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    // marginHorizontal: 40,
    borderRadius: 13,
    width: 280,
    justifyContent: 'space-between'
  },
  articleCardText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#645e5e',
    textAlign: 'center',
    padding: 20,
    textAlignVertical: 'center'
  },
  articleCardImage: {
    width: 140,
    height: 100,
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13
  },
  recipesHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20
  },
  recipesImage: {
    width: 310,
    height:170,
    borderRadius: 13,
    alignSelf: 'center',
    marginBottom: 15
  },
  viewMore: {
    color: '#5FD35D',
    fontWeight: '500',
    marginHorizontal: 20
  },
  readyIn: {
    textAlign: 'center',
    // borderRadius: 20,
    // borderWidth: 2,
    // borderColor: '#5FD35D',
    // padding: 10,
    margin: 20,
    // fontSize: 12,
    width: 250,
    alignSelf: 'center',
    fontWeight: '500',
    color: '#645e5e'
  },
  min: {
    color: '#5FD35D',
    fontSize: 15,
    fontWeight: 'bold'
  },
  recipeImage: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // position: 'absolute',
  },
  recipeScreenTitle: {
    backgroundColor: '#e4f1e4df',
    padding: 20,
    marginTop: -30,
    borderRadius: 13,
    alignSelf: 'center'
  },
  recipeAddToFavorites: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 10
  }
 
});
