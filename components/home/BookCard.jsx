import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText"; 
import { Colors } from "@/constants/Colors"; 

const bookCoverImage = require("@/assets/images/bookImage.jpg");

const BookCard = (props) => {
  const colors = Colors.light;

  return (
    <View style={styles.cardWrapper}>
      <Pressable
        android_ripple={{ color: "#e0e0e0", borderless: false }}
      >
        <View style={styles.contentContainer}>
          <Image 
            source={props.source || bookCoverImage} 
            style={styles.coverImage} 
          />
          <ThemedText type="default" style={[styles.title, { color: colors.text }]} numberOfLines={2}>{props.title}</ThemedText>
          <Text style={styles.author} numberOfLines={1}>{props.author}</Text>
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: 167,
    borderRadius: 6,
    overflow: 'hidden', // This is crucial for clipping the ripple
  },
  card: {
    width: '100%',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
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
