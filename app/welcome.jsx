import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

export default function Welcome() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/bookstop-icon.png')}
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  }
});
