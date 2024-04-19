import { View, Text } from 'react-native'

const ArticleScreen = ({ route }) => {
    const { articleId } = route.params;
    // Fetch article data based on articleId
    return (
      <View>
        <Text>Article Screen</Text>
        {/* Display article content here */}
      </View>
    );
  };
  
  export default ArticleScreen;