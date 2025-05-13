import React, { useState, useEffect, useContext } from "react";
import { View, Image, StyleSheet } from "react-native";
import { PercentageBarInline, Loading } from "@/components";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "@/components/ThemedText";
import UserContext from '@/context/UserContext';

const defaultBookCover = require("@/assets/images/bookImage.jpg");

export default function BookShelfCard(props) {
  const { user } = useContext(UserContext);
  const shelfBg = useThemeColor({}, "text");
  const shelfTitleColor = useThemeColor({}, "invert_text");
  const bgColor = useThemeColor({}, "bg_primary");

  const [books, setBooks] = useState([]);
  const [shelfTitle, setShelfTitle] = useState(props.shelfTitle || "Bookshelf"); 
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [overallProgress, setOverallProgress] = useState(0);
  useEffect(() => {
    if (props.id && user) {
      fetchBooksForShelf(props.id);
    } else if (!user) {
      setError("User not logged in.");
      setIsLoading(false);
    } else {
      setError("Shelf ID is missing.");
      setIsLoading(false);
      console.error("Shelf ID is missing from props:", props.id);
    }
  }, [props.id, user]);

  const calculateOverallProgress = (booksArray) => {
    if (!booksArray || booksArray.length === 0) {
      return 0;
    }
    const totalProgress = booksArray.reduce((sum, book) => {
      const progress = typeof book.progress === "number" ? book.progress : 0;
      return sum + progress;
    }, 0);
    return Math.round(totalProgress / booksArray.length);
  };

  const fetchBooksForShelf = async (currentShelfId) => {
    setIsLoading(true);
    setError(null);
    try {

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/shelves/get_books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ shelf_id: currentShelfId, user_id: user.id }),
        }
      );

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({
            response: `HTTP error! status: ${response.status}`,
          }));
        throw new Error(
          errorData.response || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();

      if (data.shelf_title) {
        setShelfTitle(data.shelf_title);
      }

      if (data.books && Array.isArray(data.books)) {
        const formattedBooks = data.books.map((book) => ({          id: book.id.toString(),
          coverImage:
            book.formats && book.formats["image/jpeg"]
              ? { uri: book.formats["image/jpeg"] }
              : defaultBookCover,
          progress: book.progress || 0,
        }));
        setBooks(formattedBooks);
        setOverallProgress(calculateOverallProgress(formattedBooks)); // CORRECT: Update progress here
      } else {
        setBooks([]);
        setOverallProgress(0);
        console.warn(
          "No books array found in response or it's not an array:",
          data
        );
      }
    } catch (e) {
      console.error("Failed to fetch books for shelf:", e);
      setError(
        e.message || "An unexpected error occurred while fetching books."
      );
      setOverallProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <View style={[styles.shelfCard, styles.centered]}>
        <ThemedText>Error: {error}</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.shelfCard}>
      {isLoading? (<Loading item={'books'}/>)
      :
      (
        <><View style={styles.bookRow}>
            <View style={styles.books}>
              {/* Use the 'books' state variable and 'book.coverImage' */}
              {books.slice(0, 4).map((book, index) => (
                <Image
                  key={book.id || index}
                  source={book.coverImage} // Use the coverImage from the book object in state
                  style={styles.bookCoverImage}
                  onError={(e) => console.log(
                    "Failed to load image:",
                    book.coverImage,
                    e.nativeEvent.error
                  )} // Optional: for debugging image load errors
                />
              ))}
              {books.length === 0 && !isLoading && (
                <ThemedText style={styles.emptyShelfText}>
                  No books on this shelf yet.
                </ThemedText>
              )}
            </View>
          </View><View style={[styles.shelfBg, { backgroundColor: shelfBg }]}>
              <PercentageBarInline
                percentage={overallProgress}
                style={styles.percentageBar} />
              <View style={styles.shelfInfoContainer}>
                <ThemedText
                  type="defaultSemiBold"
                  style={[{ color: shelfTitleColor }]}
                >
                  {shelfTitle}
                </ThemedText>
                <ThemedText style={[styles.bookCount, { color: shelfTitleColor }]}>
                  {books.length} Book{books.length !== 1 ? "s" : ""}
                </ThemedText>
              </View>
            </View></>
      )}
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  bookRow: {
    width: 315,
  },
  books: {
    flexDirection: "row",
    zIndex: 1,
    minHeight: 115, 
  },
  emptyShelfText: {
    top: 80,
    color: "white",
  },
  bookCoverImage: {
    width: 75,
    height: 115,
    borderRadius: 8,
    marginRight: 5,
    backgroundColor: "#e0e0e0", // Placeholder color for images
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
