import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Style from './style/Style';

export default function App() {
  return (
    <View style={Style.container}>
      <Text>Super duper recipe app</Text>
      <StatusBar style="auto" />
    </View>
  );
}

