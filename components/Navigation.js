import { NavigationContainer } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { createMaterialBottomTabNavigator } from 'react-native-paper/react-navigation';
import { PaperProvider } from 'react-native-paper';
import Home from '../screens/Home'
import Recipes from '../screens/Recipes';
import AddRecipe from '../screens/AddRecipe';
import Favorites from '../screens/Favorites';
import Profile from '../screens/Profile';
import Style from '../style/Style';
import HamburgerMenu from '../components/HamburgerMenu'
import { createDrawerNavigator } from '@react-navigation/drawer';
import Intolerances from './Intolerances';

const Tab = createMaterialBottomTabNavigator()
const Drawer = createDrawerNavigator();

export default function Navigation() {

    return (
        <PaperProvider>
            <NavigationContainer>
                <Tab.Navigator
                    style={Style.statusBar}
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
                                    ? 'circle'
                                    : 'circle-outline';
                            } else if (route.name === 'Recipes') {
                                iconName = focused
                                    ? 'circle'
                                    : 'circle-outline';
                            }
                            return <MaterialCommunityIcons
                                name={iconName}
                                size={28}
                                color={color} />;
                        }
                    })}
                >
                   <Tab.Screen name="Home">
                    {() => (
                        <Drawer.Navigator>
                            <Drawer.Screen name="Home" component={Home} />
                            <Drawer.Screen name="Intolerances" component={Intolerances} />
                        </Drawer.Navigator>
                    )}
                    </Tab.Screen>
                    <Tab.Screen name="Add recipe" component={AddRecipe} />
                    <Tab.Screen name="Favorites" component={Favorites} />
                    <Tab.Screen name="Profile" component={Profile} />
                    <Tab.Screen name="Recipes" component={Recipes} />
                </Tab.Navigator>
            </NavigationContainer>
        </PaperProvider>
    );
}