import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { db, auth } from "../firebase/Config"; // Assuming you have Firebase auth setup
import { collection, getDocs } from "firebase/firestore";




const MyRecipe = () => {

    const [userData, setUserData] = useState(null);
    const [userRecipes, setUserRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOwnRecipes = async () => {
            try {
              // Check if user is logged in
              const currentUser = auth.currentUser;
              if (currentUser) {
                const userId = currentUser.uid;
                const recipesCollectionRef = collection(db, `users/${userId}/myownrecipes`);
                const recipesSnapshot = await getDocs(recipesCollectionRef);
                const recipesData = [];
                recipesSnapshot.forEach((doc) => {
                  recipesData.push({ id: doc.id, ...doc.data() });
                });
                setUserRecipes(recipesData);
                setLoading(false);
              } else {
                console.log("User not logged in.");
                setLoading(false);
              }
            } catch (error) {
              console.error("Error fetching user recipes: ", error);
              setLoading(false);
            }
          };

        fetchOwnRecipes();
    }, []);

    return (
        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <FlatList
              data={userRecipes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}>
                  <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 5 }}>{item.title}</Text>
                  <Image source={{ uri: item.image }} style={{ width: 200, height: 200, marginBottom: 5 }} />
                  <Text style={{ marginBottom: 5 }}>Ingredients: {item.ingredients}</Text>
                  <Text>Instructions: {item.instructions}</Text>
                </View>
              )}
            />
          )}
        </View>
      );


}

export default MyRecipe;

