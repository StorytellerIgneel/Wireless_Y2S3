import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import ChatScreen from "../chat";
import FeedbackScreen from "../feedback";
import { Link } from "expo-router";

const App = () => {
  return (
    <View style={styles.container}>
        <Text style={{backgroundColor:'yellow'}}>
            Ik this is ugly af
        </Text>
      <Link href="/login">
        <Pressable>
          <Text style={{backgroundColor:'blue'}}>Login Button Lol</Text>
        </Pressable>
      </Link>
      <Link href="/chat">
        <Pressable>
          <Text style={{backgroundColor:'blue'}}>Chat Button Lol</Text>
        </Pressable>
      </Link>
      <Link href="/feedback">
        <Pressable>
          <Text style={{backgroundColor:'blue'}}>Feedback Button Lol</Text>
        </Pressable>
      </Link>
      <Link href="/profile">
        <Pressable>
          <Text style={{backgroundColor:'blue'}}>Profile Button Lol</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
