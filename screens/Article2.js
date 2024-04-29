import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style'
import { useNavigation } from '@react-navigation/native';

const Article2 = () => {

  const navigation = useNavigation();

    return (
      <View style= {styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackIcon}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView>
          <View style={styles.screenContent}>
            <Text style={styles.articleHeading}>Ideas for using different types of nuts in your cooking</Text>
            <Image source={require('../assets/peanut.jpg')} style={styles.articleImage}/>
            <Text style={styles.articleText}>Different types of nuts are very good for you and in this article we will explore 5 different ideas to use them in your cooking.</Text>
            <Text style={styles.articleText}>1. You can grate them using a grater and add them to a salad or use it as a coating/breading for meat or vegetables.</Text>
            <Text style={styles.articleText}>2. You can use them in baking to make pecan pie or any other baked good using nuts..</Text>
            <Text style={styles.articleText}>3. You can add some to a food processor when making pesto or any other kind of sauce.</Text>
            <Text style={styles.articleText}>4. You toast them in a pan or an oven with some spices and eat them as a snack.</Text>
            <Text style={styles.articleText}>5. You can make peanut butter using some dry roasted peanuts and salt and use that peanut butter to make cookies or add them into smoothies.</Text>
          </View>
        </ScrollView>
      </View>
    );
  };
  
  export default Article2;