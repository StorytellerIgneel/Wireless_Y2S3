import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ContinueReading from "../../../components/home/ContinueReading";
import { ThemedText } from "@/components/ThemedText";
import PageView from "../../../components/PageView";
import { Colors } from "@/constants/Colors";
import BookCard from "../../../components/home/BookCard";

// Sample book data (replace with your actual data source later)
const bestBooksData = [
  {
    id: "1",
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
  },
  {
    id: "3",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
  },
  {
    id: "4",
    title: "Pride and Prejudice",
    author: "Jane Austen",
  },
];

const fictionBooksData = [
  {
    id: "5",
    title: "1984",
    author: "George Orwell",
  },
  {
    id: "6",
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
  },
  {
    id: "7",
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
  },
  {
    id: "8",
    title: "Brave New World",
    author: "Aldous Huxley",
  },
];

const Home = () => {
  const colors = Colors.light;

  return (
    <SafeAreaView style={styles.container}>
      <PageView header="For You" bodyStyle={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View>
              <ThemedText
                type="subtitle"
                style={[styles.subtitle, { color: colors.text }]}
              >
                Continue Reading
              </ThemedText>
              {/* TO-DO: Replace with real data */}
              <View style={styles.continueReading}>
                <ContinueReading
                  title={"The Lord of The Rings"}
                  author={"J.R.R Tolkien"}
                  percentage={30}
                  source={''}
                />
              </View>
            </View>
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
                {bestBooksData.map((book) => (
                  <View key={book.id}>
                    <BookCard title={book.title} author={book.author} />
                  </View>
                ))}
              </ScrollView>
            </View>
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
                {fictionBooksData.map((book) => (
                  <View key={book.id}>
                    <BookCard title={book.title} author={book.author} />
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
});

export default Home;
