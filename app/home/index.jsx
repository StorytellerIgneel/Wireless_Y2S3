import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ContinueReading from "../../components/home/ContinueReading";
import { Themedtext }from "../../components/ThemedText"


const Home = () => {
  return (

    <SafeAreaView>
      <View>
        <Text>For You</Text>
        <View></View>
      </View>
        <Text>Continue Reading</Text>
        <ContinueReading title={'The Lord of The Rings'} author={'J.R.R Tolkien'} percentage={30}/>
        

    </SafeAreaView>
  );
};

export default Home;
