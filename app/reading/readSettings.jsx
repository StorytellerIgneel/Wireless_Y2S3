// // import React, { useState } from 'react';
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   StyleSheet,
// //   SafeAreaView,
// //   Dimensions,
// // } from 'react-native';
// // import Slider from '@react-native-community/slider';
// // import * as Brightness from 'expo-brightness';
// // import { Ionicons } from '@expo/vector-icons';

// // const { width } = Dimensions.get('window');

// // export default function ReadSettings({
// //   onClose = () => {},
// //   fontSize = 14,
// //   setFontSize = () => {},
// //   fontFamily = 'Arial',
// //   setFontFamily = () => {},
// //   bgColor = '#fff',
// //   setBgColor = () => {},
// //   fontColor = '#000',
// //   setFontColor = () => {},
// //   lineHeight = 1.2,
// //   setLineHeight = () => {},
// //   onPrevPage = () => {},
// //   onNextPage = () => {},
// // }) {
// //   const [brightness, setBrightness] = useState(1);

// //   const updateBrightness = async (value) => {
// //     try {
// //       setBrightness(value);
// //       await Brightness.setBrightnessAsync(value);
// //     } catch (error) {
// //       console.error('Brightness error:', error);
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.overlay}>
// //       <View style={styles.modalContent}>
// //         <Text style={styles.label}>Font Size</Text>
// //         <Slider
// //           minimumValue={10}
// //           maximumValue={24}
// //           value={fontSize}
// //           onValueChange={(val) => setFontSize(Math.round(val))}
// //           step={1}
// //         />

// //         <Text style={styles.label}>Font Family</Text>
// //         <View style={styles.row}>
// //           {['Arial', 'Georgia', 'Courier'].map((font) => (
// //             <TouchableOpacity key={font} onPress={() => setFontFamily(font)}>
// //               <Text style={[styles.fontOption, { fontFamily: font }]}>{font}</Text>
// //             </TouchableOpacity>
// //           ))}
// //         </View>

// //         <Text style={styles.label}>Line Spacing</Text>
// //         <Slider
// //           minimumValue={1}
// //           maximumValue={2}
// //           value={lineHeight}
// //           onValueChange={setLineHeight}
// //           step={0.1}
// //         />

// //         <Text style={styles.label}>Background Color</Text>
// //         <View style={styles.row}>
// //           {['#fff', '#f5f5dc', '#000'].map((color) => (
// //             <TouchableOpacity
// //               key={color}
// //               onPress={() => setBgColor(color)}
// //               style={[styles.colorBox, { backgroundColor: color }]}
// //             />
// //           ))}
// //         </View>

// //         <Text style={styles.label}>Font Color</Text>
// //         <View style={styles.row}>
// //           {['#000', '#333', '#fff'].map((color) => (
// //             <TouchableOpacity
// //               key={color}
// //               onPress={() => setFontColor(color)}
// //               style={[styles.colorBox, { backgroundColor: color }]}
// //             />
// //           ))}
// //         </View>

// //         <Text style={styles.label}>Brightness</Text>
// //         <Slider
// //           minimumValue={0.1}
// //           maximumValue={1}
// //           value={brightness}
// //           onValueChange={updateBrightness}
// //           step={0.01}
// //         />

// //         <TouchableOpacity onPress={onClose}>
// //           <Text style={styles.closeText}>Close</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Bottom arrows for page navigation */}
// //       <View style={styles.arrowContainer}>
// //         <TouchableOpacity onPress={onPrevPage} style={styles.arrowButton}>
// //           <Ionicons name="chevron-back" size={28} color="#333" />
// //         </TouchableOpacity>
// //         <TouchableOpacity onPress={onNextPage} style={styles.arrowButton}>
// //           <Ionicons name="chevron-forward" size={28} color="#333" />
// //         </TouchableOpacity>
// //       </View>
// //     </SafeAreaView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   overlay: {
// //     flex: 1,
// //     justifyContent: 'flex-end',
// //     backgroundColor: 'rgba(0,0,0,0.5)',
// //   },
// //   modalContent: {
// //     backgroundColor: '#fff',
// //     padding: 20,
// //     borderTopLeftRadius: 12,
// //     borderTopRightRadius: 12,
// //   },
// //   label: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginTop: 10,
// //     marginBottom: 4,
// //   },
// //   row: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginVertical: 10,
// //   },
// //   fontOption: {
// //     marginHorizontal: 10,
// //     fontSize: 14,
// //   },
// //   colorBox: {
// //     width: 30,
// //     height: 30,
// //     borderRadius: 4,
// //     marginHorizontal: 5,
// //     borderWidth: 1,
// //     borderColor: '#ccc',
// //   },
// //   arrowContainer: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     padding: 16,
// //     backgroundColor: '#fff',
// //   },
// //   arrowButton: {
// //     paddingHorizontal: 20,
// //     paddingVertical: 10,
// //   },
// //   closeText: {
// //     marginTop: 10,
// //     color: 'blue',
// //     fontSize: 16,
// //     textAlign: 'center',
// //   },
// // });

// import React from 'react';
// import { View, Text, Modal, StyleSheet, PanResponder, Animated } from 'react-native';

// const SettingControl = ({ label, value, setValue, step = 1, min = 1, max = 50 }) => {
//   const pan = React.useRef(new Animated.ValueXY()).current;

//   const panResponder = React.useRef(
//     PanResponder.create({
//       onMoveShouldSetPanResponder: (_, gestureState) => {
//         return Math.abs(gestureState.dy) > 10;
//       },
//       onPanResponderRelease: (_, gestureState) => {
//         if (gestureState.dy < -10) {
//           // swipe up
//           setValue(prev => Math.min(max, prev + step));
//         } else if (gestureState.dy > 10) {
//           // swipe down
//           setValue(prev => Math.max(min, prev - step));
//         }
//         Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
//       },
//     })
//   ).current;

//   return (
//     <Animated.View
//       style={styles.roundControl}
//       {...panResponder.panHandlers}
//     >
//       <Text style={styles.label}>{label}</Text>
//       <Text style={styles.value}>{value}</Text>
//     </Animated.View>
//   );
// };

// const ReadSettings = ({
//   onClose,
//   fontSize,
//   setFontSize,
//   fontFamily,
//   setFontFamily,
//   bgColor,
//   setBgColor,
//   fontColor,
//   setFontColor,
//   lineHeight,
//   setLineHeight,
// }) => {
//   return (
//     <View style={styles.modalBackground}>
//       <View style={styles.container}>
//         <Text style={styles.title}>Reading Settings</Text>

//         <SettingControl
//           label="Font Size"
//           value={fontSize}
//           setValue={setFontSize}
//           min={10}
//           max={32}
//         />

//         <SettingControl
//           label="Line Height"
//           value={lineHeight.toFixed(1)}
//           setValue={(val) => setLineHeight(parseFloat(val.toFixed(1)))}
//           step={0.1}
//           min={1}
//           max={2}
//         />

//         <SettingControl
//           label="Font Color"
//           value={fontColor}
//           setValue={(val) => setFontColor(val === '#333' ? '#000' : '#333')}
//           min={0}
//           max={1}
//         />

//         <SettingControl
//           label="Background Color"
//           value={bgColor}
//           setValue={(val) => setBgColor(val === '#fff' ? '#f4f4f4' : '#fff')}
//           min={0}
//           max={1}
//         />

//         <Text onPress={onClose} style={styles.closeButton}>Close</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   modalBackground: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.5)',
//   },
//   container: {
//     margin: 20,
//     backgroundColor: '#fff',
//     padding: 24,
//     borderRadius: 12,
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 20,
//   },
//   roundControl: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#eee',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 14,
//     color: '#555',
//   },
//   value: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#000',
//   },
//   closeButton: {
//     marginTop: 10,
//     color: '#007AFF',
//     fontSize: 16,
//   },
// });

// export default ReadSettings;

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  Animated,
} from 'react-native';

const fonts = ['Roboto', 'Arial', 'Georgia', 'Courier New', 'Times New Roman'];

const themes = [
  { bgColor: '#ffffff', fontColor: '#000000' },
  { bgColor: '#f4f4f4', fontColor: '#111111' },
  { bgColor: '#0e0e0e', fontColor: '#ffffff' },
  { bgColor: '#1f1b2e', fontColor: '#d0d0ff' },
];

export default function ReadSettings({
  onClose,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  bgColor,
  setBgColor,
  fontColor,
  setFontColor,
  lineHeight,
  setLineHeight,
  brightness,
  setBrightness,
}) {
  const [fontIndex, setFontIndex] = useState(fonts.indexOf(fontFamily) || 0);

  const createSwipeController = (label, value, setValue, step = 1, min = 10, max = 30, isFloat = false) => {
    const pan = useState(new Animated.Value(0))[0];

    const panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < -20) {
          const newValue = isFloat
            ? Math.min(parseFloat((value + step).toFixed(2)), max)
            : Math.min(value + step, max);
          setValue(newValue);
          pan.setValue(0);
        } else if (gestureState.dy > 20) {
          const newValue = isFloat
            ? Math.max(parseFloat((value - step).toFixed(2)), min)
            : Math.max(value - step, min);
          setValue(newValue);
          pan.setValue(0);
        }
      },
      onPanResponderRelease: () => {
        pan.setValue(0);
      },
    });

    return (
      <View style={styles.controller}>
        <Text style={styles.controllerLabel}>{label}</Text>
        <Animated.View {...panResponder.panHandlers} style={styles.roundControl}>
          <Text style={styles.controllerValue}>{value}</Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <Modal transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.panel}>
          <Text style={styles.title}>Reading Settings</Text>

          {createSwipeController('Font Size', fontSize, setFontSize, 1, 10, 30)}
          {createSwipeController('Line Height', lineHeight, setLineHeight, 0.1, 1, 2, true)}
          {createSwipeController('Brightness', brightness, setBrightness, 0.05, 0.1, 1, true)}

          <Text style={styles.sectionTitle}>Font</Text>
          <View style={styles.optionsRow}>
            {fonts.map((font, i) => (
              <TouchableOpacity
                key={font}
                style={[styles.fontOption, fontFamily === font && styles.selectedOption]}
                onPress={() => {
                  setFontIndex(i);
                  setFontFamily(font);
                }}
              >
                <Text style={{ fontFamily: font }}>{font}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Theme</Text>
          <View style={styles.optionsRow}>
            {themes.map((theme, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.themePreview, { backgroundColor: theme.bgColor }, bgColor === theme.bgColor && styles.selectedOption]}
                onPress={() => {
                  setBgColor(theme.bgColor);
                  setFontColor(theme.fontColor);
                }}
              />
            ))}
          </View>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  controller: {
    marginBottom: 16,
    alignItems: 'center',
  },
  controllerLabel: {
    color: '#ccc',
    marginBottom: 6,
  },
  roundControl: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2c2c2c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controllerValue: {
    fontSize: 18,
    color: '#fff',
  },
  sectionTitle: {
    color: '#ccc',
    marginVertical: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fontOption: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#333',
  },
  selectedOption: {
    borderWidth: 2,
    borderColor: '#00f',
  },
  themePreview: {
    width: 40,
    height: 40,
    borderRadius: 6,
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
