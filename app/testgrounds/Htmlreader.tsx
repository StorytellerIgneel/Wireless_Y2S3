import React, { useEffect, useState } from 'react';
import { ScrollView, useWindowDimensions, ActivityIndicator } from 'react-native';
import RenderHTML from 'react-native-render-html';

const BookReader = () => {
  const { width } = useWindowDimensions();
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {


    
    fetch('https://www.gutenberg.org/ebooks/1342.html.images')
      .then((response) => response.text())
      .then((html) => {
        setHtmlContent(html);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching HTML:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <ScrollView style={{ padding: 10 }}>
      <RenderHTML contentWidth={width} source={{ html: htmlContent }} />
    </ScrollView>
  );
};

export default BookReader;
