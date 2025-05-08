import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import ChatScreen from "../chat";
import FeedbackScreen from "../feedback";
import { Link } from "expo-router";
import Login from "../auth/login";

const App = () => {
  return (
<<<<<<< Updated upstream
    <Login />
  )
=======
    <TouchableOpacity
      style={styles.button}
      onPress={() => router.push('/auth/login')}
    >
      <Text style={styles.buttonText}>Go to Profile Page</Text>
    </TouchableOpacity>
  );
>>>>>>> Stashed changes
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
