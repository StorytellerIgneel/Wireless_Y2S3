import React, { useState, useEffect } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import ContinueReading from "@/components/home/ContinueReading";
import { ThemedText } from "@/components/ThemedText";
import PageView from "@/components/PageView";
import { Colors } from "@/constants/Colors";
import BookCard from "@/components/home/BookCard";

const Home = () => {
  const colors = Colors.light;
  const errorColor = useThemeColor({}, "error");
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

  // show loading indicator while fetching data
  if (isLoading) {
    return (
      <PageView header="For You">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.btn_bg_primary} />
          <Text style={[styles.loadingText]}>Loading books...</Text>
        </View>
      </PageView>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <PageView header="For You">
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: errorColor }]}>{error}</Text>
        </View>
      </PageView>
    );
  }

  return (
    <PageView header="For You" bodyStyle={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Continue Reading section */}
          <View style={styles.featuredSection}>
            <ThemedText
              type="subtitle"
              style={[styles.subtitle, { color: colors.text }]}
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
              style={[styles.subtitle, { color: colors.text }]}
            >
              Best Books Ever
            </ThemedText>
            <ScrollView
              horizontal={true}
              style={styles.sectionContainer}
              showsHorizontalScrollIndicator={false}
            >
              {bestBooks.map((book) => (
                <View key={book.id}>
                  <BookCard
                    title={book.title}
                    author={book.author}
                    source={book.coverImage ? { uri: book.coverImage } : null}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Fiction Books section*/}
          <View style={styles.featuredSection}>
            <ThemedText
              type="subtitle"
              style={[styles.subtitle, { color: colors.text }]}
            >
              Fiction
            </ThemedText>
            <ScrollView
              horizontal={true}
              style={styles.sectionContainer}
              showsHorizontalScrollIndicator={false}
            >
              {fictionBooks.map((book) => (
                <View key={book.id}>
                  <BookCard
                    title={book.title}
                    author={book.author}
                    source={book.coverImage ? { uri: book.coverImage } : null}
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
    flex: 1,
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
