import React, { useEffect, useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useRouter } from "expo-router";

export default function DownloadButton({ book_id }) {
  const router = useRouter();
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const htmlUrl = `https://www.gutenberg.org/files/${book_id}/${book_id}-h/${book_id}-h.htm`;
  const localHtmlPath = FileSystem.documentDirectory + "downloadedBooks/" + `${book_id}.htm`;

  useEffect(() => {
    const checkDownloaded = async () => {
      try {
        const dir = FileSystem.documentDirectory + "downloadedBooks/";
        const dirInfo = await FileSystem.getInfoAsync(dir);
        if (!dirInfo.exists) {
          await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
        }

        const fileInfo = await FileSystem.getInfoAsync(localHtmlPath);
        if (fileInfo.exists) {
          setDownloaded(true);
        }
      } catch (error) {
        console.error("Error checking file:", error);
      }
    };

    checkDownloaded();
  }, []);

  const handleShowBook = () => {
    // setShowBook(true);  // User presses the button to view the book
    router.push({
      pathname: '/downloadBook/view-container',
      params: { path: localHtmlPath },
    });
  };

  const downloadHtml = async () => {
    setLoading(true);
    try {
      const fileInfo = await FileSystem.getInfoAsync(localHtmlPath);
      if (!fileInfo.exists) {
        const downloadedFile = await FileSystem.downloadAsync(htmlUrl, localHtmlPath);
        setDownloaded(true);
      }
    } catch (e) {
      console.error('Error downloading HTML:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={{ flex: 1 }}>
      {downloaded ? (
        <Button title="View Book" onPress={handleShowBook} />
      ) : (
        <Button title="Download & View Book" onPress={downloadHtml} />
      )}
    </View>
  );
}
