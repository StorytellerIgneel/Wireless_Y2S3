import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import ReadSettings from './readSettings';
import PercentageBar from '@/components/PercentageBar';

const { width } = Dimensions.get('window');

export default function ReaderScreen() {
  const { id, title } = useLocalSearchParams();
  const navigation = useNavigation();

  const [bookText, setBookText] = useState('');
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const [showHeader, setShowHeader] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [bgColor, setBgColor] = useState('#fff');
  const [fontColor, setFontColor] = useState('#000');
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
    if (id) fetchBookText();
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
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const pageText = pages[currentPage] || '';
  const progress = pages.length > 0 ? ((currentPage + 1) / pages.length) * 100 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
      <StatusBar translucent backgroundColor="transparent" />

      {showHeader && (
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#03314B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title || 'Reading'}</Text>
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

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.fullPageTouchable}
          activeOpacity={1}
          onPress={showControls}
        >
          <ScrollView>
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
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <PercentageBar percentage={Math.round(progress)} />
      </View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity onPress={handlePreviousPage} style={styles.navButton}>
          <Ionicons name="arrow-back-circle" size={40} color="#03314B" />
        </TouchableOpacity>
        <View style={styles.pageViewContainer}>
          <Text style={styles.pageInfo}>
            {currentPage + 1} / {pages.length}
          </Text>
        </View>
        <TouchableOpacity onPress={handleNextPage} style={styles.navButton}>
          <Ionicons name="arrow-forward-circle" size={40} color="#03314B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
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
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  content: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 20, // Extra space to avoid overlap
  },
  fullPageTouchable: {
    flex: 1,
    justifyContent: 'center',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginVertical: 5,
  },
  navButton: {
    padding: 0,
  },
  pageViewContainer: {
    flex: 1,
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: 16,
  },
  pageInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: '#03314B',
  },
});
