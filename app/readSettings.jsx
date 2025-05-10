import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import * as Brightness from 'expo-brightness';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const themes = [
  {
    name: 'Light',
    bgColor: '#ffffff',
    fontColor: '#000000',
  },
  {
    name: 'Sepia',
    bgColor: '#f5e8d4',
    fontColor: '#5b4636',
  },
  {
    name: 'Dark',
    bgColor: '#121212',
    fontColor: '#ffffff',
  },
  {
    name: 'Gray',
    bgColor: '#dcdcdc',
    fontColor: '#1e1e1e',
  },
];

export default function ReadSettings({
  onClose = () => {},
  fontSize = 14,
  setFontSize = () => {},
  fontFamily = 'Arial',
  setFontFamily = () => {},
  bgColor = '#fff',
  setBgColor = () => {},
  fontColor = '#000',
  setFontColor = () => {},
  lineHeight = 1.2,
  setLineHeight = () => {},
  onPrevPage = () => {},
  onNextPage = () => {},
}) {
  const [brightness, setBrightness] = useState(1);

  const updateBrightness = async (value) => {
    try {
      setBrightness(value);
      await Brightness.setBrightnessAsync(value);
    } catch (error) {
      console.error('Brightness error:', error);
    }
  };

  const handleThemeSelect = (theme) => {
    setBgColor(theme.bgColor);
    setFontColor(theme.fontColor);
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.modalContent}>
        <Text style={styles.label}>Font Size</Text>
        <Slider
          minimumValue={10}
          maximumValue={24}
          value={fontSize}
          onValueChange={(val) => setFontSize(Math.round(val))}
          step={1}
        />

        <Text style={styles.label}>Font Family</Text>
        <View style={styles.row}>
            {['Arial', 'SpaceMono', 'Courier'].map((font) => (
            <TouchableOpacity key={font} onPress={() => setFontFamily(font)}>
                <Text style={[styles.fontOption, { fontFamily: font }]}>{font === 'SpaceMono' ? 'Default' : font}</Text>
            </TouchableOpacity>
            ))}
        </View>

        <Text style={styles.label}>Line Spacing</Text>
        <Slider
          minimumValue={1}
          maximumValue={2}
          value={lineHeight}
          onValueChange={setLineHeight}
          step={0.1}
        />

        <Text style={styles.label}>Themes</Text>
        <View style={styles.row}>
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme.name}
              style={[
                styles.themeBox,
                {
                  backgroundColor: theme.bgColor,
                  borderColor: bgColor === theme.bgColor && fontColor === theme.fontColor ? 'blue' : '#ccc',
                },
              ]}
              onPress={() => handleThemeSelect(theme)}
            >
              <Text style={{ color: theme.fontColor, fontSize: 12 }}>{theme.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Brightness</Text>
        <Slider
          minimumValue={0.1}
          maximumValue={1}
          value={brightness}
          onValueChange={updateBrightness}
          step={0.01}
        />

        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom arrows for page navigation */}
      <View style={styles.arrowContainer}>
        <TouchableOpacity onPress={onPrevPage} style={styles.arrowButton}>
          <Ionicons name="chevron-back" size={28} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onNextPage} style={styles.arrowButton}>
          <Ionicons name="chevron-forward" size={28} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  fontOption: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  themeBox: {
    width: 70,
    height: 40,
    borderRadius: 6,
    marginHorizontal: 6,
    marginBottom: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  arrowButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeText: {
    marginTop: 10,
    color: 'blue',
    fontSize: 16,
    textAlign: 'center',
  },
});
