import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";

const ContinueReading = (props) => {
  return (
    <View>
      <View></View>
      <Text>{props.title}</Text>
      <Text>{props.author}</Text>
      <View>
        <View></View>
        <View></View>
        <Text>{props.percentage}%</Text>
      </View>
      <Pressable>
        <Text>Continue</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
    
});

export default ContinueReading;
