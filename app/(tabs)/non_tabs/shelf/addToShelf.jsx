import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import axios from "axios";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { PageView, Button } from "@/components";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import UserContext from '@/context/UserContext';

function AddToShelfBookItem({ item, shelfId, onBookAdded }) {
  const { user } = useContext(UserContext);

  const [imageError, setImageError] = useState(false);
  const imageUrl = item.formats?.["image/jpeg"];

  const handleAddItemToShelf = async () => {
    if (!shelfId || !item.id) {
      Alert.alert(
        "Error",
        "Cannot add book. Shelf or book information is missing."
      );
      return;
    }
    try {
      console.log(
        `FRONTEND SENDING: Shelf ID: ${shelfId}, Book ID: ${item.id}, Title: ${item.title}`
      );

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/shelves/add_books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            shelf_id: parseInt(shelfId),
            book_id: item.id,
            user_id: user.id,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        console.error("Backend error when adding book:", errorData);
        throw new Error(
          errorData.message || `You cannot add the same book again!`
        );
      }

      const result = await response.json();
      Alert.alert(
        "Success",
        result.message || "Book added to shelf successfully!"
      );
      if (onBookAdded) {
        onBookAdded();
      }
    } catch (error) {
      console.error("Error adding book to shelf:", error);
      Alert.alert(
        "Error",
        error.message || "An unexpected error occurred while adding the book."
      );
    }
  };

  return (
    <Pressable onPress={handleAddItemToShelf}>
      <View style={styles.bookItem}>
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.bookImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.fallbackImage}>
            <Text style={styles.fallbackText}>No Image</Text>
          </View>
        )}
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {item.authors && item.authors.length > 0
              ? item.authors.map((a) => a.name).join(", ")
              : "Unknown Author"}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function AddToShelfScreen() {
  const { addingToShelfId, shelfTitle: shelfTitleFromParams } =
    useLocalSearchParams();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigation = useNavigation();
  const pageViewBackgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");

  const fetchBooksForAdding = useCallback(async (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setSearchResults([]);
    try {
      // const url = `https://gutendex.com/books?search=${encodeURIComponent(
      //   searchTerm.trim()
      // )}`;
      const url = `http://192.168.43.114:8000/books?search=${encodeURIComponent(
        searchTerm.trim()
      )}`;
      console.log("Searching books to add with term:", searchTerm);
      const response = await axios.get(url);
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Error fetching books for adding:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const title = shelfTitleFromParams
      ? `Add to: ${shelfTitleFromParams}`
      : "Add Book to Shelf";
    navigation.setOptions({ title });

    if (!addingToShelfId) {
      console.error(
        "Error: addingToShelfId is missing. This screen cannot function."
      );
      // Optionally, show an error message to the user or navigate back
      Alert.alert("Error", "Shelf information is missing. Cannot add books.", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    }
  }, [addingToShelfId, shelfTitleFromParams, navigation]);

  const handleSearchSubmit = () => {
    if (searchText.trim() === "") {
      Alert.alert("Search", "Please enter a search term to find books.");
      setSearchResults([]);
      return;
    }
    fetchBooksForAdding(searchText);
  };

  const handleBookSuccessfullyAdded = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  if (!addingToShelfId) {
    return (
      <PageView
        header={"Adding to Shelf"}
        type="back"
        style={{ backgroundColor: pageViewBackgroundColor }}
      >
        <View style={styles.centeredMessageContainer}>
          <ThemedText type="subtitle" style={{ color: errorColor }}>
            Shelf information is missing.
          </ThemedText>
        </View>
      </PageView>
    );
  }

  return (
    <PageView
      header={"Adding to Shelf"}
      type="back"
      style={{ backgroundColor: pageViewBackgroundColor }}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              { borderColor: textColor, color: textColor },
            ]}
            placeholder="Search for books to add..."
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            autoFocus={true}
          />
          <Button
            title="Search"
            onPress={handleSearchSubmit}
            style={styles.searchButton}
            textStyle={styles.searchButtonText}
          />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#007AFF"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <AddToShelfBookItem
                item={item}
                shelfId={addingToShelfId}
                onBookAdded={handleBookSuccessfullyAdded}
              />
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <ThemedText style={{ color: textColor }}>
                  {searchText
                    ? "No books found for your search."
                    : "Enter a search term to find books."}
                </ThemedText>
              </View>
            }
            contentContainerStyle={
              searchResults.length === 0 ? styles.emptyListContent : {}
            }
            keyboardShouldPersistTaps="handled"
          />
        )}
      </SafeAreaView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  searchContainer: {
    flexDirection: "column",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    width: "100%",
  },
  searchInput: {
    width: "100%",
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 16,
  },
  searchButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
  },
  loader: {
    marginTop: 20,
  },
  bookItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f9f9f9", // Consider theming
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 16,
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: "#ddd", // Consider theming
  },
  fallbackImage: {
    width: 60,
    height: 90,
    marginRight: 12,
    borderRadius: 4,
    backgroundColor: "#ccc", // Consider theming
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    fontSize: 12,
    color: "#666", // Consider theming
  },
  bookDetails: {
    flex: 1,
    justifyContent: "center",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    // color: '#333', // Consider theming
  },
  bookAuthor: {
    fontSize: 14,
    color: "#555", // Consider theming
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
});
