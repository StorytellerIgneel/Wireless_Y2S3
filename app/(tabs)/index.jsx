import React, { useState, useEffect, useContext } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import ContinueReading from "@/components/home/ContinueReading";
import { ThemedText } from "@/components/ThemedText";
import { PageView, Loading, Button } from "@/components";
import BookCard from "@/components/home/BookCard";
import UserContext from "@/context/UserContext";
import axios from "axios";

const Home = () => {
  const errorColor = useThemeColor({}, "error");
  const text = useThemeColor({}, "text");
  const router = useRouter(); // Get router instance
  const [bestBooks, setBestBooks] = useState([]);
  const [fictionBooks, setFictionBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [latestRecord, setLatestRecord] = useState(null);

  const { user } = useContext(UserContext);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLatestReadingRecord = async () => {
        // Only fetch if user is logged in
        if (!user) {
          setLatestRecord(null);
          setLoading(false);
          return;
        }

        try {
          console.log("Fetching latest reading record...");
          const response = await axios.post(
            `${process.env.EXPO_PUBLIC_API_URL}/api/shelves/get_latest_reading_record`,
            { user_id: user.id }
          );
          if (response.data.response === "No reading records found") {
            setLatestRecord(null); // Set to null if no records are found
          } else {
            setLatestRecord(response.data);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.error("Endpoint not found:", error.response.data);
            setLatestRecord(null);
          } else {
            console.error("Error fetching latest reading record:", error);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchLatestReadingRecord();

      // Return a cleanup function if needed
      return () => {
        // Any cleanup code
      };
    }, [user]) // Only re-run if user changes
  );

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);

        const bestBooksResponse = await fetch(
          "https://gutendex.com/books/?sort=popular"
        );
        const fictionBooksResponse = await fetch(
          "https://gutendex.com/books/?topic=fiction"
        );

        const bestBooksData = await bestBooksResponse.json();
        const fictionBooksData = await fictionBooksResponse.json();

        const formattedBestBooks = bestBooksData.results.map((book) => ({
          id: book.id.toString(),
          title: book.title,
          author: book.authors[0]?.name || "Unknown Author",
          coverImage: book.formats["image/jpeg"] || null,
        }));

        const formattedFictionBooks = fictionBooksData.results.map((book) => ({
          id: book.id.toString(),
          title: book.title,
          author: book.authors[0]?.name || "Unknown Author",
          coverImage: book.formats["image/jpeg"] || null,
        }));

        setBestBooks(formattedBestBooks);
        setFictionBooks(formattedFictionBooks);
      } catch (err) {
        console.error("Error fetching books:", err);
        setError("Failed to load books. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Show error message if fetch failed
  if (error) {
    return (
      <PageView header="For You" type={"profile"}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
        </View>
      </PageView>
    );
  }

  return (
    <PageView header="For You" bodyStyle={{ flex: 1 }} type={"profile"}>
      {isLoading ? (
        <Loading item={"the best books for you"} />
      ) : (
        <View style={styles.contentContainer}>
          {/* Continue Reading section */}
          <View style={styles.featuredSection}>
            <ThemedText
              type="subtitle"
              style={[styles.subtitle, { color: text }]}
            >
              Continue Reading
            </ThemedText>
            <View style={styles.continueReading}>
              {user ? (
                latestRecord ? (
                  <ContinueReading
                    bookId={latestRecord.book_id}
                    title={latestRecord.book_title}
                    author={latestRecord.author_name}
                    progress={latestRecord.progress}
                    source={latestRecord.cover_image}
                  />
                ) : (
                  <ThemedText>
                    You have no reading records, start reading by searching or
                    choosing a book below!
                  </ThemedText>
                )
              ) : (
                <View>
                  <ThemedText>Login to track your reading progress!</ThemedText>
                  <Button
                    title="Login"
                    active
                    rounded
                    onPress={() => router.navigate("/auth/login")}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Best Books section */}
          <View style={styles.featuredSection}>
            <ThemedText
              type="subtitle"
              style={[styles.subtitle, { color: text }]}
            >
              Best Books Ever
            </ThemedText>
            <ScrollView
              horizontal={true}
              style={styles.sectionContainer}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {bestBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  onPress={() => {
                    const path = `/booklist/${book.id}`;
                    router.push(path);
                  }}
                >
                  <BookCard
                    title={book.title}
                    author={book.author}
                    source={book.coverImage ? { uri: book.coverImage } : null}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Fiction Books section*/}
          <View style={styles.featuredSection}>
            <ThemedText
              type="subtitle"
              style={[styles.subtitle, { color: text }]}
            >
              Fiction
            </ThemedText>
            <ScrollView
              horizontal={true}
              style={styles.sectionContainer}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {fictionBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  onPress={() => {
                    console.log("Attempting to navigate. Book ID:", book.id);
                    const path = `/booklist/${book.id}`;
                    console.log("Constructed path:", path);
                    router.push(path);
                  }}
                >
                  <BookCard
                    title={book.title}
                    author={book.author}
                    source={book.coverImage ? { uri: book.coverImage } : null}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </PageView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: "column",
    gap: 7,
    marginTop: 7,
  },
  subtitle: {
    marginBottom: 15,
    marginLeft: 16,
  },
  sectionContainer: {
    borderRadius: 7,
    marginTop: -10,
  },
  featuredSection: {
    marginBottom: 10,
  },
  continueReading: {
    paddingHorizontal: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default Home;
