import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  UIManager,
  LayoutAnimation,
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { PageView, Button, PercentageBarInline } from "@/components";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import BookListCard from "@/components/bookshelf/BookListCard";
import { SwipeListView } from "react-native-swipe-list-view";

// Enable animations for Android
if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const getBookshelfData = (shelfId) => {
  // Sample data - replace with your actual data fetching logic
  const sampleBooks = [
    {
      id: "1",
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K Rowling",
      coverImage: require("@/assets/images/bookImage.jpg"),
      progress: 40,
    },
    {
      id: "2",
      title: "Harry Potter and the Philosopher's Stone 2",
      author: "J.K Rowling",
      coverImage: require("@/assets/images/bookImage.jpg"),
      progress: 30,
    },
    {
      id: "3",
      title: "Harry Potter and the Philosopher's Stone 3",
      author: "J.K Rowling",
      coverImage: require("@/assets/images/bookImage.jpg"),
      progress: 10,
    },
    {
      id: "4",
      title: "Harry Potter and the Philosopher's Stone 4",
      author: "J.K Rowling",
      coverImage: require("@/assets/images/bookImage.jpg"),
      progress: 20,
    },
    {
      id: "5",
      title: "Harry Potter and the Philosopher's Stone 4",
      author: "J.K Rowling",
      coverImage: require("@/assets/images/bookImage.jpg"),
      progress: 20,
    },
  ];

  // Map shelf IDs to titles - replace with dynamic data as needed
  const shelfTitles = {
    1: "Currently Reading",
    2: "To Read",
    3: "Fantasy Collection",
    4: "Sci-Fi Adventures",
  };

  return {
    id: shelfId,
    title: shelfTitles[shelfId] || "Bookshelf",
    books: sampleBooks,
    totalBooks: sampleBooks.length,
    overallProgress: 30, // This would be calculated based on individual book progress
  };
};

export default function BookshelfDetailScreen() {
  const { "shelf-id": shelfId } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();
  const [shelfData, setShelfData] = useState(null);
  const icon = useThemeColor({}, "text");

  useEffect(() => {
    if (shelfId) {
      const data = getBookshelfData(shelfId);
      setShelfData(data);

      navigation.setOptions({ title: data.title });
    }
  }, [shelfId]);

  // Function to handle removing a book from the shelf
  const handleRemoveBook = (bookId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setShelfData((prevData) => {
      const updatedBooks = prevData.books.filter((book) => book.id !== bookId);
      return {
        ...prevData,
        books: updatedBooks,
        totalBooks: updatedBooks.length,
        // Recalculate overall progress when books change
        overallProgress:
          updatedBooks.length > 0
            ? Math.round(
                updatedBooks.reduce((sum, book) => sum + book.progress, 0) /
                  updatedBooks.length
              )
            : 0,
      };
    });
  };

  // Navigate to search page when add button is pressed
  const handleAddBook = () => {
    // router.push("/non_tabs/search");
    // add book
  };

  if (!shelfData) {
    return (
      <PageView style={styles.container}>
        <ThemedText>Loading...</ThemedText>
      </PageView>
    );
  }

  // Render each book item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/non_tabs/booklist/${item.id}`)}
      style={{ width: '100%'}}
    >
      <BookListCard
        id={item.id}
        title={item.title}
        author={item.author}
        coverImage={item.coverImage}
        progress={item.progress}
      />
    </TouchableOpacity>
  );

  // Render the hidden delete button
  const renderHiddenItem = (data) => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveBook(data.item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <PageView
      style={styles.container}
      header={shelfData.title}
      bodyStyle={{ flex: 1 }}
    >
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.bookCount}>
          {shelfData.totalBooks} Book{shelfData.totalBooks > 1 ? "s" : ""}
        </ThemedText>
      </View>

      <View style={styles.progressBar}>
        <PercentageBarInline percentage={shelfData.overallProgress} />
      </View>

      <SwipeListView
        data={shelfData.books}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        keyExtractor={(item) => item.id}
        rightOpenValue={-75} // Width of delete button
        disableLeftSwipe={false}
        disableRightSwipe={true}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.buttonWrapper}>
        <Button
          type={"secondary"}
          active
          circle
          style={[styles.addButton, { color: icon }]}
          icon={"add-outline"}
          onPress={handleAddBook}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  bookCount: {
    paddingHorizontal: 20,
    fontSize: 16,
  },
  progressBar: {
    paddingHorizontal: 20,
  },
  hiddenContainer: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: '100%',
    marginBottom: 10,
  },
  deleteButton: {
    height: 130,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
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
