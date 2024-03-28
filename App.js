import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Navigation from './components/Navigation';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Recipes from './screens/Recipes';
import HamburgerMenu from './components/HamburgerMenu';

const Stack = createStackNavigator();

export default function App() {
  
  return (
          <PaperProvider>
            <SafeAreaProvider>
              <Navigation/>
            </SafeAreaProvider>
          </PaperProvider>
    );
}
