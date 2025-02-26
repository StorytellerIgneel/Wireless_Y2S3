import React from 'react';
import { View, StyleSheet } from 'react-native';
import ChatScreen from './ChatScreen';
import FeedbackScreen from './FeedbackScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <FeedbackScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});

export default App;
