import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Recipes from './screens/Recipes';
import HamburgerMenu from './components/HamburgerMenu';
import { StyleSheet, View } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  return (
    <>
    <HamburgerMenu/>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"> 
        <Stack.Screen
          name="Home"
          component={Home} 
          options={{ title: 'Home' }}
        />
        <Stack.Screen 
          name="Recipes"
          component={Recipes}
          options={{title: 'Recipes'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
