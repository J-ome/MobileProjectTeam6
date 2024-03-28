import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import Navigation from './components/Navigation';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  
  return (
          <PaperProvider>
            <SafeAreaProvider>
              <Navigation/>
            </SafeAreaProvider>
          </PaperProvider>
    );
}
