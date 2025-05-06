import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ContinueReading from "../../../components/home/ContinueReading";
import { ThemedView } from "@/components/ThemedView"; // Import ThemedView
import { ThemedText } from "@/components/ThemedText"; // Import ThemedText
import PageView from "../../../components/PageView";

const Home = () => {
  return (
    <PageView header="For You">
      <SafeAreaView>
        <Text>Continue Reading</Text>
        <ContinueReading
          title={"The Lord of The Rings"}
          author={"J.R.R Tolkien"}
          percentage={30}
        />
      </SafeAreaView>
    </PageView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
