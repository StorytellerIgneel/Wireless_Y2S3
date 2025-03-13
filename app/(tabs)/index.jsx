import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import ChatScreen from "../chat";
import FeedbackScreen from "../feedback";
import { Link } from "expo-router";
import Login from "../login";

const App = () => {
  return (
    <FeedbackScreen />
  )
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
