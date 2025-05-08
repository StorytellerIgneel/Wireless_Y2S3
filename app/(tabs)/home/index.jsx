import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ContinueReading from "../../../components/home/ContinueReading";
import { ThemedText } from "@/components/ThemedText";
import PageView from "../../../components/PageView";
import { Colors } from "@/constants/Colors";
import BookCard from "../../../components/home/BookCard";

const Home = () => {
  const colors = Colors.light;
  const [bestBooks, setBestBooks] = useState([]);
  const [fictionBooks, setFictionBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        
        const bestBooksResponse = await fetch('https://gutendex.com/books/?sort=popular');
        const fictionBooksResponse = await fetch('https://gutendex.com/books/?topic=fiction');
        
        const bestBooksData = await bestBooksResponse.json();
        const fictionBooksData = await fictionBooksResponse.json();
        
        // Format the data to match your component's expected structure
        const formattedBestBooks = bestBooksData.results.map(book => ({
          id: book.id.toString(),
          title: book.title,
          author: book.authors[0]?.name || 'Unknown Author',
          coverImage: book.formats['image/jpeg'] || null
        }));
        
        const formattedFictionBooks = fictionBooksData.results.map(book => ({
          id: book.id.toString(),
          title: book.title,
          author: book.authors[0]?.name || 'Unknown Author',
          coverImage: book.formats['image/jpeg'] || null
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
  }, []); // Empty dependency array means this runs once when component mounts

  // Show loading indicator while fetching data
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <PageView header="For You">
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.light.buttonPrimary} />
            <Text style={styles.loadingText}>Loading books...</Text>
          </View>
        </PageView>
      </SafeAreaView>
    );
  }

  // Show error message if fetch failed
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <PageView header="For You">
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        </PageView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageView header="For You" bodyStyle={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            {/* Continue Reading section */}
            <View>
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
                  source={''}
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
                  <View key={book.id} style={styles.bookCardContainer}>
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
                  <View key={book.id} style={styles.bookCardContainer}>
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
    </SafeAreaView>
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
    paddingHorizontal: 16 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  bookCardContainer: {
    marginRight: 10,
  },
});

export default Home;
