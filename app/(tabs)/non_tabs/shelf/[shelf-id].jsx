import React, { useState, useEffect, useCallback, useContext } from "react"; 
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Pressable, 
} from "react-native";
import { useLocalSearchParams, useNavigation, useRouter, useFocusEffect } from "expo-router"; 
import { PageView, Button, PercentageBarInline, Loading } from "@/components";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import BookListCard from "@/components/bookshelf/BookListCard";
import { SwipeListView } from "react-native-swipe-list-view";
import UserContext from '@/context/UserContext';

const calculateOverallProgress = (booksArray) => {
  if (!booksArray || booksArray.length === 0) {
    return 0; 
  }

  const totalProgress = booksArray.reduce((sum, book) => {
    const progress = typeof book.progress === 'number' ? book.progress : 0;
    return sum + progress;
  }, 0);

  return Math.round(totalProgress / booksArray.length);
};

export default function BookshelfDetailScreen() {
  const { "shelf-id": shelfIdParam, title: shelfTitleFromParams } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  const { user } = useContext(UserContext);

  const [books, setBooks] = useState([]);
  const [shelfTitle, setShelfTitle] = useState(shelfTitleFromParams || "Bookshelf");
  const [isLoading, setIsLoading] = useState(true); // Set to true initially
  const [error, setError] = useState(null);
  const [overallProgress, setOverallProgress] = useState(0); 
  
  const icon = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");
  const shelfId = parseInt(shelfIdParam); 

  useEffect(() => {
    if (shelfTitle) {
      navigation.setOptions({ title: shelfTitle });
    }
  }, [shelfTitle, navigation]);

  const fetchBooksForShelfCallback = useCallback(async (currentShelfId) => {
    if (!currentShelfId) {
      setError("Shelf ID is missing for fetch.");
      setIsLoading(false);
      console.error("Shelf ID is missing for fetch:", currentShelfId);
      return;
    }
    console.log(`Fetching books for shelf: ${currentShelfId} (from focus effect or direct call)`);
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/shelves/get_books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ shelf_id: currentShelfId, user_id: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ response: `HTTP error! status: ${response.status}` }));
        throw new Error(errorData.response || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.shelf_title && data.shelf_title !== shelfTitle) {
        setShelfTitle(data.shelf_title);
      }

      if (data.books && Array.isArray(data.books)) {
        const formattedBooks = data.books.map(book => ({
          id: book.id.toString(),
          title: book.title || "No Title",
          author: book.authors && book.authors.length > 0 ? book.authors.map(a => a.name).join(', ') : "Unknown Author",
          coverImage: book.formats && book.formats['image/jpeg'] ? { uri: book.formats['image/jpeg'] } : null, 
          progress: book.progress || 0,  
        }));
        setBooks(formattedBooks);
        setOverallProgress(calculateOverallProgress(formattedBooks)); 
      } else {
        setBooks([]);
        setOverallProgress(0); 
        console.warn("No books array found in response or it's not an array:", data);
      }
    } catch (e) {
      console.error("Failed to fetch books for shelf:", e);
      setError(e.message || "An unexpected error occurred while fetching books.");
      setBooks([]); 
      setOverallProgress(0);
    } finally {
      setIsLoading(false);
    }
  }, [shelfTitle, navigation]); 

  useFocusEffect(
    useCallback(() => {
      if (shelfId) {
        fetchBooksForShelfCallback(shelfId);
      } else {
        setError("Shelf ID is missing.");
        setIsLoading(false);
        console.error("Shelf ID is missing from params on focus:", shelfIdParam);
      }

      return () => {
      };
    }, [shelfId, fetchBooksForShelfCallback, shelfIdParam]) 
  );

  const handleRemoveBook = async (bookIdToRemove) => {
    const originalBooks = [...books];
    
    const updatedBooks = originalBooks.filter(book => book.id !== bookIdToRemove);
    setBooks(updatedBooks);
    setOverallProgress(calculateOverallProgress(updatedBooks)); 

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/shelves/delete_books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          shelf_id: shelfId, 
          book_id: bookIdToRemove,
          user_id: user.id 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ response: `Failed to remove book. Status: ${response.status}` }));
        throw new Error(errorData.response || `Failed to remove book. Status: ${response.status}`);
      }
      
      console.log("Book removed successfully from shelf:", shelfId, "book:", bookIdToRemove);

    } catch (apiError) {
      console.error("Failed to remove book via API:", apiError);
      setBooks(originalBooks);
      setOverallProgress(calculateOverallProgress(originalBooks)); 
      alert(`Error removing book: ${apiError.message}`);
    }
  };

  const handleAddBook = () => {
    router.push({
      pathname: "/(tabs)/non_tabs/shelf/addToShelf",
      params: {
        addingToShelfId: shelfId,
        shelfTitle: shelfTitle 
      }
    });
  };

  if (error) {
    return (
      <PageView header={shelfTitle} type={"back"}>
        <View style={styles.centeredMessageContainer}>
          <ThemedText style={{ color: errorColor, textAlign: 'center', marginBottom: 10 }}>{error}</ThemedText>
          <Button title="Retry" onPress={() => fetchBooksForShelf(shelfId)} />
        </View>
      </PageView>
    );
  }

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => router.push(`(tabs)/non_tabs/booklist/${item.id}`)}
      style={{ width: "100%" }}
    >
      <BookListCard
        id={item.id}
        title={item.title}
        author={item.author}
        coverImage={item.coverImage} 
        progress={item.progress}
      />
    </Pressable>
  );

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

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.bookCount}>
          {books.length} Book{books.length !== 1 ? "s" : ""}
        </ThemedText>
      </View>
      <View style={styles.progressBar}>
        <PercentageBarInline percentage={overallProgress} /> 
      </View>
    </>
  );

  return (
    <View style={{ flex: 1 }}>
      <PageView
        style={styles.container}
        header={shelfTitle}
        bodyStyle={{ flex: 1 }}
        type={"back"}
      >
      {isLoading ? (
        <Loading item={'bookshelf'}/>
      ) : books.length === 0 ? (
        <View style={styles.centeredMessageContainer}>
          <ThemedText>This bookshelf is empty.</ThemedText>
        </View>
      ) : (
        <SwipeListView
          data={books}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          rightOpenValue={-75}
          disableLeftSwipe={false} 
          disableRightSwipe={true} 
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
        />
      )}
      </PageView>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredMessageContainer: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  bookCount: {
    fontSize: 16,
  },
  progressBar: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  hiddenContainer: {
    alignItems: "center", 
    backgroundColor: "red",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    height: '100%', 
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    height: '100%',
  },
  buttonWrapper: {
    position: "absolute",
    width: 55,
    height: 55,
    alignSelf: "center",
    bottom: 20,
    borderRadius: 100,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  addButton: {
    marginTop: 0, 
    width: 55,
    height: 55,
  },
});
