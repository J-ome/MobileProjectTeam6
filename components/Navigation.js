import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { PaperProvider } from 'react-native-paper';
import Home from '../screens/Home'
import Recipe from '../screens/Recipe';
import Recipes from '../screens/Recipes';
import AddRecipe from '../screens/AddRecipe';
import Favorites from '../screens/Favorites';
import Profile from '../screens/Profile';
import Article1 from '../screens/Article1';
import Article2 from '../screens/Article2';
import MyRecipes from '../screens/MyRecipes'
import Style, {MyTheme} from '../style/Style';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Intolerances from './Intolerances';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from "@react-navigation/native";

const Tab = createMaterialBottomTabNavigator()
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function Navigation() {


    const RecipeStack = () => (
        <Stack.Navigator>
          <Stack.Screen name="Recipeslist" component={Recipes} options={{ headerShown: false }} />
          <Stack.Screen name="Recipe" component={Recipe} options={{ headerShown: false }} />
        </Stack.Navigator>
      );

      const ArticleStack = () => (
        <Stack.Navigator>
            <Stack.Screen name="HomeArticle" component={Home} options={{ headerShown: false }} />
           <Stack.Screen name="Article1" component={Article1} options={{ headerShown: false }} />
           <Stack.Screen name="Article2" component={Article2} options={{ headerShown: false }} />
        </Stack.Navigator>
      )

      const ProfileStack = () => (
        <Stack.Navigator>
            <Stack.Screen name="ProfileStack" component={Profile} options={{ headerShown: false }} />
           <Stack.Screen name="MyRecipes" component={MyRecipes} options={{ headerShown: false }} /> 
           <Stack.Screen name="Intolerances" component={Intolerances} options={{ headerShown: false }} /> 
        </Stack.Navigator>
      )

    return (
        <PaperProvider theme={MyTheme}>
            <NavigationContainer>
            {/* <Drawer.Navigator screenOptions={{
                drawerStyle: {
                backgroundColor: '#ffffff'}}}>
                <Drawer.Screen name="Culinary Cosmos" component={HomeTab} options={{headerStyle: {backgroundColor: '#5FD35D'}}} />
                <Drawer.Screen name="Recipes" component={RecipeStack} />
                <Drawer.Screen name="Intolerances" component={Intolerances} />
            </Drawer.Navigator> */}
             <Tab.Navigator
                    style={Style.bottomTab}
                    labeled={false}
                    barStyle={{ backgroundColor: '#ffffff' }}
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'Home') {
                                iconName = focused
                                    ? 'home'
                                    : 'home-outline';
                            } else if (route.name === 'Add recipe') {
                                iconName = focused
                                    ? 'plus-box'
                                    : 'plus-box-outline';
                            } else if (route.name === 'Favorites') {
                                iconName = focused
                                    ? 'heart'
                                    : 'heart-outline';
                            } else if (route.name === 'Profile') {
                                iconName = focused
                                    ? 'account'
                                    : 'account-outline';
                            } else if (route.name === 'Recipes') {
                                iconName = focused
                                    ? 'clipboard-text'
                                    : 'clipboard-text-outline';
                            } 
                            return <MaterialCommunityIcons
                                name={iconName}
                                size={28}
                                color={color} />;
                        }
                    })}
                >
                    <Tab.Screen name="Home" component={ArticleStack} />
                    <Tab.Screen name="Recipes" component={RecipeStack} />
                    <Tab.Screen name="Add recipe" component={AddRecipe} />
                    <Tab.Screen name="Favorites" component={Favorites} />
                    <Tab.Screen name="Profile" component={ProfileStack} />
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}