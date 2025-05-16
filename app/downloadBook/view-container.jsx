import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import * as FileSystem from 'expo-file-system';

export default function ViewContainer() {
  const { path } = useLocalSearchParams();
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    const loadHtml = async () => {
      try {
        const content = await FileSystem.readAsStringAsync(path);
        setHtmlContent(content);
      } catch (e) {
        console.error("Failed to read file:", e);
      }
    };

    if (path) loadHtml();
  }, [path]);

  useEffect(() => {
    console.log(path)
  })
  if (!htmlContent) return <ActivityIndicator size="large" color="blue" />;

  return (
    <View style={{ flex: 1 }}>
      <WebView 
            source={{ html: htmlContent }} 
            originWhitelist={['*']}
            style={{ flex: 1 }}
            startInLoadingState={true}
        />
    </View>
  );
}
