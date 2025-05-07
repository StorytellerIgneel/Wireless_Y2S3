import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const PAGE_CHAR_LIMIT = 1200;

export default function ReaderScreen() {
  const { id, title } = useLocalSearchParams();
  const navigation = useNavigation();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const flatListRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    fetchBookText();
  }, [id]);

  const fetchBookText = async () => {
    try {
      const res = await axios.get(`https://www.gutenberg.org/cache/epub/${id}/pg${id}.txt`);
      const text = res.data;
      const cleanText = text.replace(/\r\n/g, '\n').replace(/\n{2,}/g, '\n\n');
      const chunks = paginateText(cleanText);
      setPages(chunks);
    } catch (err) {
      console.error('Failed to fetch book text:', err);
    } finally {
      setLoading(false);
    }
  };

  const paginateText = (text) => {
    const pages = [];
    let pointer = 0;
    while (pointer < text.length) {
      pages.push(text.slice(pointer, pointer + PAGE_CHAR_LIMIT).trim());
      pointer += PAGE_CHAR_LIMIT;
    }
    return pages;
  };

  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index || 0);
    }
  }).current;

  const toggleHeader = () => {
    setShowHeader(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setShowHeader(false), 5000);
  };

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      {/* Tap area to show the transparent header */}
      <Pressable style={styles.headerTapArea} onPress={toggleHeader}>
        <Ionicons name="ellipsis-vertical" size={24} color="transparent" />
      </Pressable>

      {showHeader && (
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {title}
          </Text>
          <Ionicons name="bookmark-outline" size={22} color="#007AFF" style={{ marginLeft: 8 }} />
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={pages}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => (
          <View style={styles.page}>
            <View style={styles.pageContent}>
              <Text style={styles.pageText}>{item}</Text>
            </View>
          </View>
        )}
      />

      <View style={styles.progressContainer}>
        <View
          style={[styles.progressBar, { width: `${(currentPage + 1) / pages.length * 100}%` }]}
        />
        <Text style={styles.progressText}>
          Page {currentPage + 1} / {pages.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  headerTapArea: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // semi-transparent background
    zIndex: 10,
  },

  backButton: {
    marginRight: 10,
  },

  headerTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    flexShrink: 1,
  },

  page: {
    width: width,
    padding: 20,
    justifyContent: 'center',
  },

  pageContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 16,
    backgroundColor: '#fdfdfd',
  },

  pageText: {
    fontFamily: 'Arial',
    fontSize: 14,
    lineHeight: 16.8, // 1.2 * 14
    color: '#333',
  },

  progressContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#fff',
    paddingBottom: 8,
    alignItems: 'center',
  },

  progressBar: {
    height: 4,
    backgroundColor: '#fcbf49',
    borderRadius: 2,
    width: '0%',
  },

  progressText: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
});
