import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import PercentageBar from "../PercentageBar";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";

const unavailableBookCover = require("@/assets/images/bookImage.jpg");

export default function BookListCard(props) {

  return (
      <View style={styles.bookItem}>
        <Image source={props.coverImage || unavailableBookCover} style={styles.coverImage} />
        <View style={styles.bookDetails}>
          <ThemedText
            type="defaultSemiBold"
            numberOfLines={2}
            style={styles.bookTitle}
          >
            {props.title}
          </ThemedText>
          <ThemedText
            type="subtitleGrey"
            style={styles.authorText}
            numberOfLines={1}
          >
            {props.author}
          </ThemedText>
          <PercentageBar percentage={props.progress} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  bookItem: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "white",
  },
  coverImage: {
    width: 75,
    height: 115,
    borderRadius: 8,
  },
  bookDetails: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  bookTitle: {
    marginBottom: 4,
  },
  authorText: {
    marginBottom: 8,
  },
});