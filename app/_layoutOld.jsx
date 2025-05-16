import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import Welcome from './welcome';
import { UserProvider } from '@/context/UserContext';
import { NotifProvider } from '@/context/NotifContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Arial: require('../assets/fonts/Arimo-VariableFont_wght.ttf'),
    Courier: require('../assets/fonts/CourierPrime-Regular.ttf'),
  });

  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      const timer = setTimeout(() => {
        setIsSplashVisible(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || isSplashVisible) {
    return <Welcome />;
  }

  return (
    <UserProvider>
      <NotifProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="drawer" />
            {/* <Stack.Screen name="(tabs)" /> */}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </NotifProvider>
    </UserProvider>
  );
}
