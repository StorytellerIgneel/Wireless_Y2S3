import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';  // Import Ionicons
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { PageView } from '@/components';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchGenres();
    }, [])
  );

  const fetchGenres = async () => {
    try {
      const response = await axios.get('https://gutendex.com/books/');
      const genreSet = new Set();

      response.data.results.forEach((book) => {
        book.bookshelves.forEach((shelf) => {
          if (shelf && typeof shelf === 'string') {
            genreSet.add(shelf); // Keep raw shelf string for fetch
          }
        });
      });

      const sortedGenres = Array.from(genreSet).sort((a, b) =>
        a.replace(/^Browsing\s*:\s*/i, '').localeCompare(b.replace(/^Browsing\s*:\s*/i, ''))
      );

      setGenres(sortedGenres);
    } catch (error) {
      console.error('Error fetching genres:', error);
    } finally {
      setLoadingGenres(false);
    }
  };

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      Alert.alert('Empty Search', 'Please enter a search query.');
      return;
    }

    router.push({
      pathname: '/(tabs)/search/search_result',
      params: { query: trimmedQuery },
    });
  };

  const handleGenreSelect = (genre) => {
    router.push({
      pathname: '/(tabs)/search/search_result',
      params: { genre }, // Use raw string (untrimmed)
    });
  };

  return (
    <PageView header="Search" type={'profile'}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Enter keywords (title, author, subject...)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              style={styles.searchInput} // ADD THIS STYLE
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
              <Ionicons name="arrow-forward" size={24} color="#007bff" />
            </TouchableOpacity>
          </View>
          <View>
              <Text style={styles.subheader}>Explore Categories</Text>
              {loadingGenres ? (
              <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <ScrollView
                contentContainerStyle={styles.genreButtonContainer}
                showsVerticalScrollIndicator={false}
              >
                  {genres.map((genre) => (
                  <TouchableOpacity
                      key={genre}
                      style={styles.genreButton}
                      onPress={() => handleGenreSelect(genre)}
                  >
                      <Text style={styles.genreButtonText}>
                      {genre.replace(/^Browsing\s*:\s*/i, '').trim()}
                      </Text>
                  </TouchableOpacity>
                  ))}
              </ScrollView>
              )}
          </View>
        </SafeAreaView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subheader: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  searchButton: {
    paddingLeft: 10,
  },
  genreButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 100, 
  },
  genreButton: {
    width: '30%',
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  genreButtonText: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
  },
});
