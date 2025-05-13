import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText"; 
import { useThemeColor } from "@/hooks/useThemeColor";


const bookCoverImage = require("@/assets/images/bookImage.jpg");

const BookCard = (props) => {
  const textColor = useThemeColor({}, 'text');
  return (
    <View style={styles.cardWrapper}>
        <View style={styles.contentContainer}>
          <Image 
            source={props.source || bookCoverImage} 
            style={styles.coverImage} 
          />
          <ThemedText type="default" style={[styles.title, { color: textColor }]} numberOfLines={2}>{props.title}</ThemedText>
          <ThemedText type='subtitleGrey' numberOfLines={1}>{props.author}</ThemedText>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: 150,
    borderRadius: 6,
    overflow: 'hidden',
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
});

export default BookCard;
