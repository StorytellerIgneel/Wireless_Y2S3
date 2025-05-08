import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView"; // Use ThemedView
import { ThemedText } from "@/components/ThemedText"; // Use ThemedText
import { Colors } from "@/constants/Colors"; // Import Colors for theme

// Assuming you have the image locally or a URI
const bookCoverImage = require("@/assets/images/bookImage.png"); // Adjust path as needed

const ContinueReading = (props) => {
  // Use light theme colors directly for this example, or use a theme hook if available
  const colors = Colors.light;

  return (
    <ThemedView style={styles.card}>
      <Image source={bookCoverImage} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.title}
        </ThemedText>
        <ThemedText
          style={styles.author}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.author}
        </ThemedText>

        <View style={styles.progressRow}>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${props.percentage}%` },
              ]}
            />
          </View>
          <ThemedText style={styles.percentageText}>
            {props.percentage}%
          </ThemedText>
        </View>

        <Pressable
          style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
        >
          <ThemedText type="defaultSemiBold" style={[styles.buttonText, {color: colors.text}]} >Continue</ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row", // Arrange image and content side-by-side
    borderRadius: 10,
    backgroundColor: "#F0F0F0", // White card background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 16,
  },
  coverImage: {
    width: 125,
    aspectRatio: 2 / 3,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  contentContainer: {
    flex: 1, // Take remaining space
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  title: {
    fontSize: 17,
    marginBottom: 2,
  },
  author: {
    fontSize: 14,
    color: "#687076", // Grey color for author
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: "column",
    flex: 1,
  },
  progressBarContainer: {
    backgroundColor: "#E0E0E0", // Light grey background for progress bar
    borderRadius: 4,
    height: 8,
  },
  progressBarFill: {
    borderRadius: 4,
    backgroundColor: "#FEB802",
    height: 8,
  },
  percentageText: {
    fontSize: 12,
    color: "#687076", // Grey color for percentage
    minWidth: 35, // Ensure space for "100%"
    textAlign: "right",
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 20, // Rounded button
    alignItems: "center",
    alignSelf: "flex-end", // Align button to the start
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    fontSize: 17,
  },
});

export default ContinueReading;
