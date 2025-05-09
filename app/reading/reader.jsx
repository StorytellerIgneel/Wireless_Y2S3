import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import ReadSettings from './readSettings';

const { width } = Dimensions.get('window');

export default function ReaderScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [bookText, setBookText] = useState('');
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showHeader, setShowHeader] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [bgColor, setBgColor] = useState('#fff');
  const [fontColor, setFontColor] = useState('#333');
  const [modalVisible, setModalVisible] = useState(false);
  const [lineHeight, setLineHeight] = useState(1.2);

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

  const pageText = pages[currentPage] || '';
  const progress = pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {showHeader && (
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reading</Text>
          <View style={{ width: 24 }} />
        </Animated.View>
      )}

      <TouchableOpacity style={styles.dotsIcon} onPress={() => setModalVisible(true)}>
        <Ionicons name="ellipsis-vertical" size={24} color="gray" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <ReadSettings
          onClose={() => setModalVisible(false)}
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          bgColor={bgColor}
          setBgColor={setBgColor}
          fontColor={fontColor}
          setFontColor={setFontColor}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
        />
      </Modal>

      <View style={styles.page}>
        <TouchableOpacity style={styles.navIconLeft} onPress={handlePreviousPage}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.textContainer} onTouchStart={showControls}>
          <Text
            style={{
              fontFamily,
              fontSize,
              lineHeight: fontSize * lineHeight,
              color: fontColor,
            }}
          >
            {pageText}
          </Text>
        </ScrollView>

        <TouchableOpacity style={styles.navIconRight} onPress={handleNextPage}>
          <Ionicons name="chevron-forward" size={24} color="black" />
        </TouchableOpacity>
      </View>

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
  },
  page: {
    flex: 1,
    padding: 5,
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
  progressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  progressContainer: {
    height: 6,
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