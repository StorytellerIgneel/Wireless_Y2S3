import React from "react";
import { StyleSheet, ScrollView, Pressable, View } from "react-native";
import { PageView, Button } from "@/components";
import BookshelfCard from "@/components/bookshelf/BookshelfCard";
import { useThemeColor } from "@/hooks/useThemeColor";

// Sample book data - can be reused for all shelves or customized per shelf
const sampleBooks = [
  require("@/assets/images/bookImage.jpg"),
  require("@/assets/images/bookImage.jpg"),
  require("@/assets/images/bookImage.jpg"),
  require("@/assets/images/bookImage.jpg"),
  require("@/assets/images/bookImage.jpg"),
  // Add more book cover sources here
];

// Sample data for multiple bookshelves
const bookshelfData = [
  {
    id: "shelf1",
    shelfTitle: "Currently Reading",
    books: sampleBooks.slice(0, 3), // Example: 3 books on this shelf
    percentage: 75,
  },
  {
    id: "shelf2",
    shelfTitle: "To Read",
    books: sampleBooks.slice(0, 4), // Example: 4 books
    percentage: 10,
  },
  {
    id: "shelf3",
    shelfTitle: "Fantasy Collection",
    books: sampleBooks.slice(0, 2), // Example: 2 books
    percentage: 90,
  },
  {
    id: "shelf4",
    shelfTitle: "Sci-Fi Adventures",
    books: sampleBooks, // All sample books
    percentage: 45,
  },
];

export default function Bookshelf() {
  const icon = useThemeColor({}, "text");
  return (
    <PageView header="My Shelf" bodyStyle={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        {bookshelfData.map((shelf) => (
          <Pressable
            key={shelf.id}
            android_ripple={{ color: "rgba(0, 0, 0, 0.20)", borderless: false }}
          >
            <BookshelfCard
              books={shelf.books}
              percentage={shelf.percentage}
              shelfTitle={shelf.shelfTitle}
            />
          </Pressable>
        ))}
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          type={"secondary"}
          active
          circle
          style={[styles.addButton, { color: icon }]}
          icon={"add-outline"}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonWrapper: {
    position: "absolute",
    width: 55,
    height: 55,
    alignSelf: "center",
    bottom: 10,
    borderRadius: 100, 
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  addButton: {
    marginTop: 0,
    width: 55,
    height: 55,
  },
});
