import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ReaderScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [bookText, setBookText] = useState('');
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { user } = useContext(UserContext);

  const userId = user ? user.id : -1

  const showControls = () => {
    setShowHeader(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setShowHeader(false));
    }, 5000);
  };

  useEffect(() => {
    if (id) {
      fetchBookText();
      fetchReadingProgress();
    }
  }, [id]);

  const fetchBookText = async () => {
    try {
      const res = await axios.get(`https://www.gutenberg.org/files/${id}/${id}-0.txt`);
      const text = res.data;
      setBookText(text);
      paginateText(text);
    } catch (error) {
      console.error('Error fetching book text:', error);
    }
  };

  const paginateText = (text) => {
    const words = text.split(/\s+/);
    const wordsPerPage = 300;
    const paged = [];

    for (let i = 0; i < words.length; i += wordsPerPage) {
      paged.push(words.slice(i, i + wordsPerPage).join(' '));
    }

    setPages(paged);
  };

  const goToPage = (pageNum) => {
    if (pageNum < 0) pageNum = 0;
    if (pageNum >= pages.length) pageNum = pages.length - 1;
    setCurrentPage(pageNum);
  };

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const fetchReadingProgress = async () => {
  try {
    const res = await axios.post("http://<your-backend-url>/get_book_latest_record", {
      book_id: id,
      user_id: userId,
    });
    if (res.data.progress) {
      const savedProgress = res.data.progress;
      const savedPage = Math.floor((savedProgress / 100) * pages.length);
      setCurrentPage(savedPage);
    }
  } catch (error) {
    console.error("Error fetching reading progress:", error);
  }
};

  const updateReadingProgress = async (progress) => {
  try {
    await axios.post("http://<your-backend-url>/log_book", {
      book_id: id,
      user_id: userId,
      progress: Math.round(progress),
    });
  } catch (error) {
    console.error("Error updating reading progress:", error);
  }
};

  const pageText = pages[currentPage] || '';
  const progress = ((currentPage + 1) / pages.length) * 100;

  return (
    <View style={styles.container}>
      {/* Header with back & title (shown on 3-dot tap) */}
      {showHeader && (
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reading</Text>
          <View style={{ width: 24 }} />
        </Animated.View>
      )}

      {/* 3-dots menu icon */}
      <TouchableOpacity style={styles.dotsIcon} onPress={showControls}>
        <Ionicons name="ellipsis-vertical" size={24} color="gray" />
      </TouchableOpacity>

      {/* Reader content */}
      <View style={styles.page}>
        <TouchableOpacity
          style={styles.navIconLeft}
          onPress={handlePreviousPage}
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.textContainer}>
          <Text style={styles.pageText}>{pageText}</Text>
        </ScrollView>

        <TouchableOpacity
          style={styles.navIconRight}
          onPress={handleNextPage}
        >
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Progress */}
      <View style={styles.progressBox}>
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(progress)}%</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dotsIcon: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 20,
    padding: 4,
    backgroundColor: 'transparent',
  },
  page: {
    flex: 1,
    padding: 5, // <== Added padding around content
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navIconLeft: {
    padding: 10,
  },
  navIconRight: {
    padding: 10,
  },
  textContainer: {
    flexGrow: 1,
    width: width - 100,
    paddingHorizontal: 10,
  },
  pageText: {
    fontFamily: 'Arial',
    fontSize: 14,
    lineHeight: 17, // 14 * 1.2
    color: '#333',
  },
  progressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  progressContainer: {
    height: 6, // <== Reduced height
    width: '85%',
    borderRadius: 3,
    backgroundColor: '#eee',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: 'gold',
  },
  progressText: {
    width: 40,
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
  },
});
