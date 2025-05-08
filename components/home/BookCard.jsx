import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText"; // Use ThemedText
import { ThemedView } from "@/components/ThemedView"; // Use ThemedView
import { Colors } from "@/constants/Colors"; // Import Colors for theme

const bookCoverImage = require("@/assets/images/bookImage.png"); // Adjust path as needed

const BookCard = (props) => {
  const colors = Colors.light;

  return (
    <Pressable
      style={styles.card}
      android_ripple={{ color: "#e0e0e0", borderless: false }}
    >
      <View 
      style={styles.contentContainer}
      >
        <Image source={bookCoverImage} style={styles.coverImage} />
        <ThemedText type="default" style={[styles.title, { color: colors.text }]} numberOfLines={2}>{props.title}</ThemedText>
        <Text style={styles.author} numberOfLines={1}>{props.author}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 155,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 10,
    borderRadius: 6,
    gap: 3,
  },
  coverImage: {
    width: 135,
    height: 200,
    borderRadius: 6,
  },
  title: {
    fontSize: 17,
    marginBottom: 2,
  },
  author: {
    fontSize: 14,
    color: "#687076", // Grey color for author
  },
});

export default BookCard;
