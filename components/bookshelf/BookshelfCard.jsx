import { View, Image, StyleSheet } from "react-native";
import { PercentageBarInline } from "../PercentageBar";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";

export default function BookShelfCard(props) {
  const shelfBg = useThemeColor({}, "text");
  const shelfTitleColor = useThemeColor({}, "invert_text");
  return (
    <View style={styles.shelfCard}>
      <View style={styles.bookRow}>
        <View style={styles.books}>
          {props.books.slice(0, 4).map((cover, index) => (
            <Image key={index} source={cover} style={styles.bookCoverImage} />
          ))}
        </View>
      </View>
      <View style={[styles.shelfBg, { backgroundColor: shelfBg }]}>
        <PercentageBarInline
          percentage={props.percentage}
          style={styles.percentageBar}
        />
        <View style={styles.shelfInfoContainer}>
          <ThemedText
            type="defaultSemiBold"
            style={[styles.shelfTitle, { color: shelfTitleColor }]}
          >
            {props.shelfTitle}
          </ThemedText>
          <ThemedText style={[styles.bookCount, { color: shelfTitleColor }]}>
            {props.books.length} Books
          </ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shelfCard: {
    marginVertical: 10,
    flexDirection: "column",
    alignItems: "center",
    height: 185,
    position: "relative",
  },
  bookRow: {
    width: 315
  },
  books: {
    flexDirection: "row",
    zIndex: 1,
  },
  bookCoverImage: {
    width: 75,
    height: 115,
    borderRadius: 8,
    marginRight: 5,
  },
  shelfBg: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 135,
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    justifyContent: "flex-end",
    zIndex: 0,
  },
  percentageBar: {
    marginBottom: 10,
  },
  shelfInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bookCount: {
    fontSize: 12,
  },
});
