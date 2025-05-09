import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

// Custom back button component that matches your design
function CustomBackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity 
      onPress={() => router.back()}
      style={styles.backButton}
    >
      <Ionicons name="arrow-back" size={24} color="white" />
    </TouchableOpacity>
  );
}

export default function BooklistLayout() {
  return(
    <Stack 
      screenOptions={{ 
        headerShown: true,
        headerBackVisible: false, 
        headerTitle: "", 
        headerTransparent: true, 
        headerShadowVisible: false, 
        headerLeft: () => <CustomBackButton />,
      }}
    />
  ); 
}

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: '#1b3a57', // Dark blue color matching your image
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  }
});
