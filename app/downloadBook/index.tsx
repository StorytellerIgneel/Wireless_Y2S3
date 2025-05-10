import React, { useEffect, useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

export default function DownloadButton({ book_id }) {
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showBook, setShowBook] = useState(false);  // State to control when to show the book

  const htmlUrl = `https://www.gutenberg.org/files/${book_id}//${book_id}-h//${book_id}-h.htm`;
  const localHtmlPath = FileSystem.documentDirectory + "downloadedBooks/" + `${book_id}.html`;

  useEffect(() => {
    const checkDownloaded = async () => {
      const fileInfo = await FileSystem.getInfoAsync(localHtmlPath);
      setDownloaded(fileInfo.exists);
    };
    checkDownloaded();
  }, []);

  const downloadHtml = async () => {
    setLoading(true);
    try {
      const fileInfo = await FileSystem.getInfoAsync(localHtmlPath);
      if (!fileInfo.exists) {
        // Download the file if it does not exist
        await FileSystem.downloadAsync(htmlUrl, localHtmlPath);
      }
      setDownloaded(true); // Mark as downloaded
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleShowBook = () => {
    setShowBook(true);  // User presses the button to view the book
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={{ flex: 1 }}>
      {showBook ? (
        <WebView source={{ uri: `file://${localHtmlPath}` }} />
      ) : (
        <View>
          {downloaded ? (
            <Button title="View Book" onPress={handleShowBook} />
          ) : (
            <Button title="Download & View Book" onPress={downloadHtml} />
          )}
        </View>
      )}
    </View>
  );
}
