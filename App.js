import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Navigation from './components/Navigation';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { AuthProvider } from './components/AuthContext';import { MyTheme } from './style/Style';


export default function App() {
  
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <AuthProvider>
          <Navigation/>
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
