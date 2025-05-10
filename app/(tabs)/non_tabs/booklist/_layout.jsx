import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function BooklistLayout() {
  return(
    <Stack 
      screenOptions={{ 
        headerShown: false,
        headerBackVisible: false, 
      }}
    />
  ); 
}
