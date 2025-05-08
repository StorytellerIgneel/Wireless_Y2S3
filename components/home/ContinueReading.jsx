import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { PrimaryButton } from "@/components/Button"; 

const bookCoverImage = require("@/assets/images/bookImage.png");

const ContinueReading = (props) => {
  const colors = Colors.light;

  return (
    <ThemedView style={styles.card}>
      <Image source={bookCoverImage} style={styles.coverImage} />
      <View style={styles.contentContainer}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
        >
          {props.title}
        </ThemedText>
        <ThemedText
          type="subtitleGrey"
          numberOfLines={1}
          style= {styles.author}
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

        <PrimaryButton
          title="Continue"
          onPress={() => {/* TO-DO: Handle continue reading */}}
        />
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
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
    flex: 1, 
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  title: {
    fontSize: 17,
    marginBottom: 2,
  },
  author: {
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: "column",
    flex: 1,
  },
  progressBarContainer: {
    backgroundColor: "#E0E0E0", 
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
    color: "#687076",
    minWidth: 35, 
    textAlign: "right",
  },
});

export default ContinueReading;
