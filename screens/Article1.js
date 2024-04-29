import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import styles from '../style/Style'
import { useNavigation } from '@react-navigation/native';

const Article1 = () => {

  const navigation = useNavigation();

    return (
      <View style= {styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackIcon}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 40, paddingTop: 18 }}>Articles</Text>
        </View>
        <ScrollView>
          <View style={styles.screenContent}>
            <Text style={styles.articleHeading}>Exploring the World of Egg Cookery: Eight Different Ways To Cook Eggs</Text>
            <Image source={require('../assets/eggs.jpg')} style={styles.articleImage}/>
            <Text style={[styles.articleText, {marginBottom: 30}]}>Eggs are a versatile and nutritious ingredient that grace breakfast tables, enrich savory dishes, and even star in elegant desserts. Whether you prefer them scrambled, poached, or sunny-side up, there's a myriad of ways to enjoy the humble egg. Join us on a culinary journey as we explore some of the most delightful methods to cook eggs.</Text>
            <Text style={styles.articleTitle}>1. Sunny-Side Up: </Text>
            <Text style={styles.articleText}>Simple yet sublime, the sunny-side-up egg showcases the golden yolk in all its glory. To prepare, crack an egg into a hot, greased skillet and cook until the white sets while leaving the yolk soft and runny. Serve with toast for a classic breakfast delight.</Text>
            <Text style={styles.articleTitle}>2. Scrambled Eggs:</Text>
            <Text style={styles.articleText}>Velvety and comforting, scrambled eggs are a breakfast staple loved by all. Whisk eggs with a splash of milk, season with salt and pepper, then cook over low heat, gently stirring until the eggs form soft curds. Customize with cheese, herbs, or veggies for added flavor.</Text>
            <Text style={styles.articleTitle}>3. Poached Eggs:</Text>
            <Text style={styles.articleText}>Mastering the art of poaching eggs yields a luxurious treat with a perfectly cooked egg nestled in a delicate blanket of whites. Simmer water with a splash of vinegar, create a whirlpool, gently slide in cracked eggs, and cook until the whites are set but the yolks remain runny. Ideal for topping toast, salads, or indulgent eggs Benedict.</Text>
            <Text style={styles.articleTitle}>4. Hard-Boiled Eggs:</Text>
            <Text style={styles.articleText}>Versatile and convenient, hard-boiled eggs are a portable snack, a salad topping, or a protein-packed addition to sandwiches. Simply boil eggs in water for about 10-12 minutes, then cool and peel for a nutritious on-the-go option.</Text>
            <Text style={styles.articleTitle}>5. Soft-Boiled Eggs:</Text>
            <Text style={styles.articleText}>Delightfully creamy with a molten center, soft-boiled eggs are a delicacy often enjoyed for breakfast or as a topping for noodles or salads. Boil eggs for about 6-7 minutes, then crack open and scoop out the luscious yolk with a spoon, savoring every spoonful.</Text>
            <Text style={styles.articleTitle}>6. Omelette:</Text>
            <Text style={styles.articleText}>A canvas for creativity, omelettes offer endless possibilities for customization. Whisk eggs with a splash of milk, pour into a hot skillet, add your favorite fillings such as cheese, vegetables, or meats, then fold and cook until golden and fluffy. Perfect for a quick and satisfying meal any time of day.</Text>
            <Text style={styles.articleTitle}>7. Baked Eggs:</Text>
            <Text style={styles.articleText}>Elegant and effortless, baked eggs are a brunch favorite that can be dressed up with gourmet ingredients or kept simple and rustic. Crack eggs into individual ramekins, add toppings like ham, spinach, or cheese, then bake until the whites are set and the yolks are still soft and luscious.</Text>
            <Text style={styles.articleTitle}>8. Shirred Eggs:</Text>
            <Text style={styles.articleText}>Similar to baked eggs but with a touch of elegance, shirred eggs are baked in a shallow dish with cream or sauce, resulting in a velvety texture and rich flavor. Perfect for entertaining or a cozy weekend breakfast.</Text>
          </View>
        </ScrollView>
      </View>
    );
  };
  
  export default Article1;