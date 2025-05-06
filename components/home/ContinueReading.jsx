import React from "react";
import { StyleSheet, View, Text, Pressable, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView"; // Use ThemedView
import { ThemedText } from "@/components/ThemedText"; // Use ThemedText
import { Colors } from "@/constants/Colors"; // Import Colors for theme

// Assuming you have the image locally or a URI
const bookCoverImage = require('@/assets/images/bookImage.png'); // Adjust path as needed

const ContinueReading = (props) => {
  // Use light theme colors directly for this example, or use a theme hook if available
  const colors = Colors.light; 

  return (
    <ThemedView style={styles.card}>
      <Image source={bookCoverImage} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <ThemedText type="defaultSemiBold" style={styles.title}>{props.title}</ThemedText>
        <ThemedText style={styles.author}>{props.author}</ThemedText>
        
        <View style={styles.progressRow}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${props.percentage}%`, backgroundColor: colors.tint }]} />
          </View>
          <ThemedText style={styles.percentageText}>{props.percentage}%</ThemedText>
        </View>

        <Pressable style={[styles.button, { backgroundColor: '#FFC107' }]}>
          <Text style={styles.buttonText}>Continue</Text>
        </Pressable>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', // Arrange image and content side-by-side
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#FFFFFF', // White card background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0', // Light border
  },
  coverImage: {
    width: 80,
    height: 120, // Adjust height to match aspect ratio
    borderRadius: 4,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1, // Take remaining space
    justifyContent: 'space-between', // Distribute content vertically
  },
  title: {
    fontSize: 16,
    // color: '#07314A', // Already handled by ThemedText if theme is light
    marginBottom: 2,
  },
  author: {
    fontSize: 14,
    color: '#687076', // Grey color for author
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBarContainer: {
    flex: 1, // Take most space
    height: 8,
    backgroundColor: '#E0E0E0', // Light grey background for progress bar
    borderRadius: 4,
    overflow: 'hidden', // Ensure fill stays within bounds
    marginRight: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
    // backgroundColor is set dynamically based on theme tint color
  },
  percentageText: {
    fontSize: 12,
    color: '#687076', // Grey color for percentage
    minWidth: 35, // Ensure space for "100%"
    textAlign: 'right',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20, // Rounded button
    alignItems: 'center',
    alignSelf: 'flex-start', // Align button to the start
    // backgroundColor: '#FFC107', // Yellow button color
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#333333', // Dark text on yellow button
    fontWeight: '600',
    fontSize: 14,
  },
});

export default ContinueReading;
