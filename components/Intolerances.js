import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style'
import { useNavigation } from '@react-navigation/native';


export default Intolerances = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackIcon}>
        <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.screenContent}>
          <Text style={styles.articleHeading}>Intolerances and Dietary Restrictions </Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Dairy Free </Text> - excludes dairy (dairy = milk, yogurt, cheese, butter, cream) or any product made with dairy</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Egg free </Text> - excludes any recipe made with eggs.</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Gluten free </Text> - excludes any recipe that has gluten in it</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Grain free </Text> - excludes grains (grains = wheat, bulgur, spelt, farro, quinoa, rice, millet + some plant-based milks) and products made from grains like pasta, crackers, breads, cereals</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Peanut free </Text> - excludes peanuts and products containing peanuts</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Seafood free </Text> - excludes fish (fish = tuna, salmon, cod, haddock, perch, tilapia, halibut) NOTE: this is more fish-free than seafood</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Sesame free </Text> - excludes sesame seeds and any products containing sesame</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Shellfish free </Text> - excludes shellfish (shellfish = prawns, shrimp, crab, lobster, crayfish, yabbies, oysters, scallops, mussels, squid, calamari, clams) and products containing shellfish like shrimp paste</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Soy free </Text> - excludes any product made using soybean</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Tree nut free </Text> - excludes tree nuts (tree nut = Almond, Artifical nuts, Beechnut, Brazil nut, White walnut, Cashew, Chestnut, Chinaquapin nut, Coconut, Hazelnut, Gianduja, Ginkgo nut, Hickory nut, Lychee nut, Macadamia nut, Marzipan/almond paste, Nangai nut, Natural nut extract, Nut butter, Nut meal, Nut meat, Nut milk, Nut oils, Nut paste, Nut pieces, Pecan, Pesto, Pili nut, Pine nut, Pistachio, Praline, Shea nut, Walnut, Walnut hull extract)</Text>
            <Text style={styles.articleText}><Text style={styles.articleTitle}>Wheat free </Text> - excludes any recipe that uses wheat</Text>
        </View>
      </ScrollView>
    </View>
  )
}