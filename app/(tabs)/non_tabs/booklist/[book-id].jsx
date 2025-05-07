import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function BookDetailsScreen() {
  const router = useRouter();
  const { 'book-id': id } = useLocalSearchParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const navigation = useNavigation();

  const scrollY = useRef(new Animated.Value(0)).current;
  const stickyY = useRef(0);
  const stickyRef = useRef(null);

  const [stickyPosition, setStickyPosition] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetchBookDetails();
    console.log(id);
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const res = await axios.get(`https://gutendex.com/books/${id}`);
      setBook(res.data);
      navigation.setOptions({ title: res.data.title });
    } catch (error) {
      console.error('Failed to fetch book:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (!book) return <Text style={{ marginTop: 40 }}>Book not found.</Text>;

  const {
    title,
    authors,
    download_count,
    formats,
    languages,
    translators,
    bookshelves,
    summaries,
  } = book;

  const authorNames = authors
    .map((a) => {
      const years = a.birth_year && a.death_year ? ` (${a.birth_year}–${a.death_year})` : '';
      return `${a.name}${years}`;
    })
    .join(', ');

  const languageList = languages?.join(', ') || '';
  const translatorNames = translators?.map((t) => t.name).join(', ') || '';
  const bookshelf = bookshelves?.[0]?.replace(/^Browsing\s*:\s*/i, '') || '';
  const summaryText = summaries?.join('\n\n') || '';
  const wordCount =
    formats?.['text/plain; charset=utf-8']?.length
      ? `${(formats['text/plain; charset=utf-8'].length / 5).toLocaleString()} words`
      : '';
  const imageUrl = formats?.['image/jpeg'];

  const translateY = scrollY.interpolate({
    inputRange: [stickyPosition - 1, stickyPosition, stickyPosition + 1],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.coverImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.coverPlaceholder}>
            <Text>No Cover Image</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{title || ''}</Text>
          <Text style={styles.author}>{authorNames || ''}</Text>
          {(download_count || wordCount) && (
            <Text style={styles.meta}>
              {download_count?.toLocaleString() || ''} Downloads{' '}
              {wordCount ? `/ ${wordCount}` : ''}
            </Text>
          )}
          {(languageList || translatorNames) && (
            <Text style={styles.meta}>
              {languageList}
              {translatorNames ? ` / Translated by ${translatorNames}` : ''}
            </Text>
          )}
          {bookshelf ? (
            <View style={styles.bookshelfBox}>
              <Text style={styles.bookshelfText}>{bookshelf}</Text>
            </View>
          ) : null}
        </View>

        {/* Sticky container placeholder (gets layout Y position) */}
        <View
          onLayout={(event) => {
            const layoutY = event.nativeEvent.layout.y;
            setStickyPosition(layoutY);
          }}
        >
          <View style={styles.divider} />
        </View>

        {/* Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>What’s it about?</Text>
          <Text style={styles.summaryText}>{summaryText}</Text>
        </View>
      </Animated.ScrollView>

      {/* Sticky Action Bar */}
      <Animated.View
        style={[
          styles.stickyContainer,
          {
            transform: [{ translateY }],
          },
        ]}
      >
        <Pressable
          onPress={() => setBookmarked((prev) => !prev)}
          style={styles.iconButton}
        >
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={24}
            color="gold"
          />
        </Pressable>
        <Pressable onPress={() => router.push(`reader?id=${id}`)} style={styles.readButton}>
          <Text style={styles.readButtonText}>Start Reading</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 60 },
  coverImage: {
    width: width,
    height: width * 1.2,
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    width: width,
    height: width * 1.2,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 20,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'left',
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
    textAlign: 'left',
  },
  meta: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    textAlign: 'left',
  },
  bookshelfBox: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#ffeb99',
    borderRadius: 12,
    marginTop: 6,
  },
  bookshelfText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  stickyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: '',
    padding: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    // position: 'absolute',
   // top: 600,
    left: 0,
    right: 0,
  },
  iconButton: {
    padding: 6,
  },
  readButton: {
    backgroundColor: 'gold',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginLeft: 12,
  },
  readButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 14,
  },
  summaryContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
});
