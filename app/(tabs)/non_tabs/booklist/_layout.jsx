import { Stack } from 'expo-router';

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
