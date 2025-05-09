import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from './ThemedText';  
import { ThemedView } from './ThemedView';  
import Icon from './Icon';  

const CustomHeader = ({ showTitle = true, title = 'Title' }) => {
  const router = useRouter();

  return (
    <ThemedView style={styles.headerContainer}>
      <Pressable onPress={() => router.back()}>
        <Icon
          name="arrow-back-circle-sharp"
          size={40}
          color="#07314A"  
        />
      </Pressable>

      {showTitle && (
        <ThemedText type="title" style={styles.titleText}>
          {title}
        </ThemedText>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    elevation: 2, 
  },
  titleText: {
    marginLeft: 15,
  },
});

export default CustomHeader;
