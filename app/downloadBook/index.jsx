import React, { useEffect, useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useRouter } from "expo-router";

export default function DownloadButton({ book_id }) {
  const router = useRouter();

  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);

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
    router.push({
      pathname: '/downloadBook/view-container',
      params: { uri: localHtmlPath },
    });
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={{ flex: 1 }}>
      <View>
        {downloaded ? (
          <Button title="View Book" onPress={handleShowBook} />
        ) : (
          <Button title="Download & View Book" onPress={downloadHtml} />
        )}
      </View>
    </View>
  );
}
