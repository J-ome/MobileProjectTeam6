import React, { useState, useEffect } from "react";
import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../firebase/Config";
import { collection, getDocs } from "firebase/firestore";
import Style from "../style/Style";

const Favorites = () => {
  const [userFavorites, setUserFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSummaries, setExpandedSummaries] = useState({}); // Keep track of expanded summaries
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const favoritesCollectionRef = collection(db, `users/${userId}/favorites`);
          const favoritesSnapshot = await getDocs(favoritesCollectionRef);
          const favoritesData = favoritesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setUserFavorites(favoritesData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites: ", error);
        setLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  const toggleExpandedSummary = (id) => {
    setExpandedSummaries((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderSummary = (summary, id) => {
    const maxLength = 150;
    const isExpanded = expandedSummaries[id] || false;

    if (isExpanded || summary.length <= maxLength) {
      return (
        <>
          {summary}
          {isExpanded && (
            <TouchableOpacity onPress={() => toggleExpandedSummary(id)}>
              <Text style={{ color: "blue" }}> View less</Text>
            </TouchableOpacity>
          )}
        </>
      );
    } else {
      const truncatedSummary = summary.substring(0, maxLength);
      return (
        <>
          {truncatedSummary}
          <TouchableOpacity onPress={() => toggleExpandedSummary(id)}>
            <Text style={{ color: "blue" }}> View more</Text>
          </TouchableOpacity>
        </>
      );
    }
  };

  const navigateToRecipe = (recipeId) => {
    // Navigate to the recipe screen with the specified recipeId
    navigation.navigate("Recipe", { recipeId });
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    } else if (auth.currentUser) {
      if (userFavorites.length === 0) {
        return (
          <View style={{ alignItems: "center" }}>
            <Text style={{ marginVertical: 20 }}>You have no favorites yet</Text>
          </View>
        );
      } else {
        return (
          <>
        <Text style={Style.header}>Recipes</Text>
        <FlatList
            data={userFavorites}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View>
            <TouchableOpacity onPress={() => navigateToRecipe(item.id)}>
                <Text>{item.title}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigateToRecipe(item.id)}>
                <Image source={{ uri: item.image }} style={{ width: 200, height: 200, marginBottom: 5 }} />
              </TouchableOpacity>
                <Text>{renderSummary(item.fullSummary, item.id)}</Text>
              </View>
            )}
          />
          </>
      );
      }
    } else {
      return (
        <View>
          <Text style={Style.header}>Recipes</Text>
        <View style={{ alignItems: "center" }}>
          <Text style={{ marginTop: 5 }}><Text onPress={() => navigation.navigate('Profile')} style={{ color: 'blue' }}> Log in</Text> or <Text onPress={() => navigation.navigate('Profile')} style={{ color: 'blue' }}>Sign up</Text> to view your favorites</Text>
        </View>
        </View>
      );
    }
  };

  return <View>{renderContent()}</View>;
};

export default Favorites;
