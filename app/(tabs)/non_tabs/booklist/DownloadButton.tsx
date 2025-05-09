import React, { useEffect, useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

//documentDirectory points to the app's sandbox
// which is /data/user/0/host.exp.exponent/files/
//the suffix is the specific file

export default function DownloadButton({book_id}) {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(false);

  const htmlUrl = `https://www.gutenberg.org/files/${book_id}//${book_id}-h//${book_id}-h.htm`;
  const localHtmlPath = FileSystem.documentDirectory + `${book_id}.html`;
  //"file:///data/user/0/host.exp.exponent/files/x.html"

  const downloadHtml = async () => {
    setLoading(true);
    try {
      //await FileSystem.deleteAsync(localHtmlPath, { idempotent: true });  // This deletes the file if it existsm
      await FileSystem.downloadAsync(htmlUrl,localHtmlPath); //download the file from the html to the local sandbox
      const content = await FileSystem.readAsStringAsync(localHtmlPath); //read file as string (to bypass sandbox limitations)
      setHtmlContent(content);
      console.log(htmlContent)
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={{ flex: 1 }}>
      {htmlContent ? (
        <Button title="Downloaded" disabled={true} color="gray"/>
      //   <WebView
      //   originWhitelist={['*']}
      //   source={{ uri: localHtmlPath }}
      //   style={{ flex: 1 }}
      //   allowFileAccess={true}
      // />
      ) : (
        <Button title="Download & View Book" onPress={downloadHtml} />
      )}
    </View>
  );
}
