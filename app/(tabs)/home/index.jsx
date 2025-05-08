import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ContinueReading from "../../../components/home/ContinueReading";
import { ThemedText } from "@/components/ThemedText"; // Import ThemedText
import PageView from "../../../components/PageView";
import { Colors } from "@/constants/Colors"; // Import Colors for theme
import BookCard from "../../../components/home/BookCard";

const Home = () => {
  const colors = Colors.light;

  return (
    <PageView header="For You">
      <SafeAreaView>
        <ScrollView>
          <View style={styles.contentContainer}>
            <View>
              <ThemedText
                type="subtitle"
                style={[styles.subtitle, { color: colors.text }]}
              >
                Continue Reading
              </ThemedText>
              <ContinueReading
                title={"The Lord of The Rings"}
                author={"J.R.R Tolkien"}
                percentage={30}
              />
            </View>
            <View>
              <ThemedText
                type="subtitle"
                style={[styles.subtitle, { color: colors.text }]}
              >
                Fiction
              </ThemedText>
              <ScrollView horizontal={true} style={styles.sectionContainer}>
                <View style={styles.bookCard}>
                  <BookCard
                    title={"Harry Potter and the Philosoper's Stone"}
                    author={"J.K Rowling sdsasaffsfds"}
                  />
                </View>
              </ScrollView>
            </View>
            <View>
              <ThemedText
                type="subtitle"
                style={[styles.subtitle, { color: colors.text }]}
              >
                Fiction
              </ThemedText>
              <ScrollView horizontal={true} style={styles.sectionContainer}>
                <View style={styles.bookCard}>
                  <BookCard
                    title={"Harry Potter and the Philosoper's Stone"}
                    author={"J.K Rowling sdsasaffsfds"}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
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
    gap: 10 
  },
  subtitle: {
    marginBottom: 15,
  },
  sectionContainer: {
    borderRadius: 7,
    marginTop: -10,
  },
});

export default Home;
