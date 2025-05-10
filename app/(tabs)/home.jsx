import React, { useState, useEffect } from "react";
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
import { PageView, Loading } from "@/components";
import BookCard from "@/components/home/BookCard";

const Home = () => {
  const errorColor = useThemeColor({}, "error");
  const text = useThemeColor({}, "text");
  const router = useRouter(); // Get router instance
  const [bestBooks, setBestBooks] = useState([]);
  const [fictionBooks, setFictionBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <ContinueReading
                title={"The Lord of The Rings"}
                author={"J.R.R Tolkien"}
                percentage={30}
                source={""}
              />
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
                    const path = `/(tabs)/non_tabs/booklist/${book.id}`;
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
                    const path = `/(tabs)/non_tabs/booklist/${book.id}`;
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
