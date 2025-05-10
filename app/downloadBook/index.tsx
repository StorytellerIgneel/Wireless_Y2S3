import React, { useEffect, useState } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { readFilesFromDocumentDirectory } from './check_downloaded';

//documentDirectory points to the app's sandbox
// which is /data/user/0/host.exp.exponent/files/
//the suffix is the specific file

export default function DownloadButton({book_id}) {
  const [downloaded, setDownloaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const htmlUrl = `https://www.gutenberg.org/files/${book_id}//${book_id}-h//${book_id}-h.htm`;
  //const htmlUrl = `https://www.gutenberg.org/files/1259//1259-h//1259-h.htm`;
  const localHtmlPath = FileSystem.documentDirectory + "downloadedBooks/" + `${book_id}.html`;
  //const localHtmlPath = FileSystem.documentDirectory + "downloadedBooks/" + `1259.html`;
  //"file:///data/user/0/host.exp.exponent/files/x.html"

  useEffect(()=>{
    const checkDownloaded = async () => {
      const fileInfo = await FileSystem.getInfoAsync(localHtmlPath);
      setDownloaded(fileInfo.exists);
    };
    checkDownloaded();
  }, [])
  const downloadHtml = async () => {
    setLoading(true);
    try {
      //await FileSystem.deleteAsync(localHtmlPath, { idempotent: true });  // This deletes the file if it existsm
      const fileInfo = await FileSystem.getInfoAsync(localHtmlPath);

      if(!fileInfo.exists) {
        await FileSystem.downloadAsync(htmlUrl,localHtmlPath); //download the file from the html to the local sandbox
        const content = await FileSystem.readAsStringAsync(localHtmlPath); //read file as string (to bypass sandbox limitations)
        console.log(content)
      }
      setDownloaded(true);
      console.log(readFilesFromDocumentDirectory());
    } catch (e) {
      console.error('Error:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={{ flex: 1 }}>
      {downloaded ? (
        <Button title="Downloaded" disabled={true} color="gray"/>
      ) : (
        <Button title="Download & View Book" onPress={downloadHtml} />
      )}
    </View>
  );
}
