import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import Button from "@/components/Button";
import PercentageBar from "../PercentageBar";
import { useRouter } from "expo-router";

const bookCoverImage = require("@/assets/images/bookImage.jpg");

const ContinueReading = (props) => {
  const colors = Colors.light;
  const router = useRouter();

  return (
    <ThemedView style={styles.card}>
      <Image
        source={
          props.source && typeof props.source === "string"
            ? { uri: props.source }
            : bookCoverImage
        }
        style={styles.coverImage}
      />
      <View style={styles.contentContainer}>
        <ThemedText
          type="defaultSemiBold"
          style={[styles.title, { color: colors.text }]}
          numberOfLines={1}
        >
          {props.title}
        </ThemedText>
        <ThemedText type="subtitleGrey" numberOfLines={1} style={styles.author}>
          {props.author}
        </ThemedText>

        <PercentageBar percentage={props.progress || 0} />

        <Button
          type="primary"
          active
          rounded
          title="Continue"
          style={{
            width: 130,
            alignSelf: "flex-end",
          }}
          onPress={() => {
            router.push({
              pathname: "/reader",
              params: {
                id: props.bookId,
                title: props.title,
              },
            });
          }}
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
  },
  coverImage: {
    width: 130,
    aspectRatio: 2 / 3,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  title: {
    fontSize: 17,
    marginBottom: 2,
  },
  author: {
    marginBottom: 10,
  },
});

export default ContinueReading;
