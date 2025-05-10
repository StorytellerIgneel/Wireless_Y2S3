import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Pressable,
} from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import Loading from '@/components';

function BookItem({ item }) {
  const [imageError, setImageError] = useState(false);
  const imageUrl = item.formats?.['image/jpeg'];
  const router = useRouter();

  return (
    <Pressable onPress={() => {
      alert(`Navigating to book ID: ${item.id}`);
      router.push(`non_tabs/booklist/${item.id}`);
    }}>
      <View style={styles.bookItem}>
        {imageUrl && !imageError ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.bookImage}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View style={styles.fallbackImage}>
            <Text style={styles.fallbackText}>No Image</Text>
          </View>
        )}
        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>
            {item.authors.map((a) => a.name).join(', ') || 'Unknown Author'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function BookListScreen() {
  const { query, genre } = useLocalSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);        // Reset loading
    setBooks([]);            // Clear current books
  
    // This will set the title based on the current query or genre
    const title =
      query && query !== 'undefined'
        ? `Results for "${query}"`
        : genre && genre !== 'undefined'
        ? `${genre.replace(/^Browsing\s*:\s*/i, '').trim()} Books`
        : 'Books';
  
    navigation.setOptions({ title });
    fetchBooks(query, genre); // Pass query and genre explicitly to the fetchBooks function
  }, [query, genre]); // Ensure this effect runs when either query or genre changes
  
  const fetchBooks = async (query, genre) => {
    try {
      console.log('Fetching with:', query, genre);
      let url = 'https://gutendex.com/books?';
  
      if (query && query !== 'undefined') {
        url += `search=${encodeURIComponent(query)}`;
      } else if (genre && genre !== 'undefined') {
        url += `bookshelves=${encodeURIComponent(genre)}`;
      } else {
        console.warn('No valid query or genre provided.');
        setBooks([]);
        return;
      }
  
      const response = await axios.get(url);

      const filteredResults =
      genre && genre !== 'undefined'
        ? response.data.results.filter(book =>
            (book.bookshelves || []).some(
              shelf => shelf.toLowerCase() === genre.toLowerCase()
            )
          )
        : response.data.results;

      // If there are no filtered results, return an empty array
      const finalResults = filteredResults.length > 0 ? filteredResults : [];

      // console.log(finalResults);

      setBooks(filteredResults);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Loading item={'books'}/>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <BookItem item={item} />}
          ListEmptyComponent={<Text>No books found.</Text>}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  bookItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  bookImage: {
    width: 60,
    height: 90,
    borderRadius: 4,
    marginRight: 12,
    backgroundColor: '#ddd',
  },
  fallbackImage: {
    width: 60,
    height: 90,
    marginRight: 12,
    borderRadius: 4,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fallbackText: {
    fontSize: 12,
    color: '#666',
  },
  bookDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});