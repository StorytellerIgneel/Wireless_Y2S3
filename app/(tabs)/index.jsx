import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import ChatScreen from "../chat";
import FeedbackScreen from "../feedback";
import { Link } from "expo-router";
import Notif from "../notification";

const App = () => {
  return (
    <Notif />
  )
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
