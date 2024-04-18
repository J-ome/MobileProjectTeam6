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
import Style from '../style/Style';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Intolerances from './Intolerances';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createMaterialBottomTabNavigator()
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function Navigation() {


      const HomeTab = () => (
        <Tab.Navigator
                    // style={Style.statusBar}
                    labeled={false}

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
                                    ? 'account-cog'
                                    : 'account-cog-outline';
                            } 
                            return <MaterialCommunityIcons
                                name={iconName}
                                size={28}
                                color={color} />;
                        }
                    })}
                >
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Add recipe" component={AddRecipe} />
                <Tab.Screen name="Favorites" component={Favorites} />
                <Tab.Screen name="Profile" component={Profile} />
                {/* <Tab.Screen name="Recipes" component={RecipeStack} /> */}
                </Tab.Navigator>
      );
      
      const RecipeStack = () => (
        <Stack.Navigator>
          <Stack.Screen name="Recipeslist" component={Recipes} />
          <Stack.Screen name="Recipe" component={Recipe} options={{ headerShown: false }} />
        </Stack.Navigator>
      );

    return (
        <PaperProvider>
            <NavigationContainer>
            <Drawer.Navigator>
                <Drawer.Screen name="Recipe App" component={HomeTab} />
                <Drawer.Screen name="Recipes" component={RecipeStack} />
                <Drawer.Screen name="Intolerances" component={Intolerances} />
            </Drawer.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}