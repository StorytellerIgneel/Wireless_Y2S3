import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer'; // Correct import
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { ThemedText } from '@/components/ThemedText'; 
import Icon from '@/components/Icon';
import Login from './auth/login';
import Welcome from './welcome';
import { UserProvider } from '@/context/UserContext';
import { useNavigation } from 'expo-router';
import { Drawer } from 'expo-router/drawer';

// List of screens to exclude from the Drawer
const excludedScreens = ['(tabs)', 'index', 'auth', 'welcome', 'reading/reader'];

// Prevent splash screen from hiding automatically
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const navigation = useNavigation();

  // if (showLogin) {
  //   return (
  //     <UserProvider>
  //       <Login />
  //     </UserProvider>
  //   );
  // }

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      const timer = setTimeout(() => {
        setIsSplashVisible(false);
        setShowLogin(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || isSplashVisible) {
    return <Welcome />;
  }
  return (
    <UserProvider>
      <ThemeProvider value={DefaultTheme}> {/* replace 'colorScheme === "dark" ? DarkTheme : DefaultTheme' with DefaultTheme if colorScheme is not defined */}
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: true,
            headerTitle: '', // Hide header title by setting it to an empty string
            // headerLeft: () => <DrawerToggle />, // Use the new DrawerToggle component
            drawerIcon: () => (
              <Icon name="menu" size={30} color="#07314A" style={{ marginLeft: 20, marginRight: 20 }} />
            ),
          }}
        >
           {!excludedScreens.includes('chat') && (
          <Drawer.Screen
            name="chat"
            options={{
              drawerLabel: () => <ThemedText type="label">Chat</ThemedText>,
              drawerIcon: () => (
                <Icon name="chatbubble-ellipses-outline" size={22} color="#07314A" />
              ),
            }}
          /> )}
           {!excludedScreens.includes('faq') && (
          <Drawer.Screen
            name="faq"
            options={{
              drawerLabel: () => <ThemedText type="label">FAQ</ThemedText>,
              drawerIcon: () => (
                <Icon name="help-circle-outline" size={22} color="#07314A" />
              ),
            }}
          /> )}

          {!excludedScreens.includes('feedback') && (
          <Drawer.Screen
            name="feedback"
            options={{
              drawerLabel: () => <ThemedText type="label">Feedback</ThemedText>,
              drawerIcon: () => (
                <Icon name="chatbubbles-outline" size={22} color="#07314A" />
              ),
            }}
          /> )}

          {!excludedScreens.includes('profile') && (
          <Drawer.Screen
            name="profile"
            options={{
              drawerLabel: () => <ThemedText type="label">Profile</ThemedText>,
              drawerIcon: () => (
                <Icon name="person-outline" size={22} color="#07314A" />
              ),
            }}
          />)}

          {!excludedScreens.includes('terms') && (
          <Drawer.Screen
            name="terms"
            options={{
              drawerLabel: () => <ThemedText type="label">Terms</ThemedText>,
              drawerIcon: () => (
                <Icon name="document-text-outline" size={22} color="#07314A" />
              ),
            }}
          />)}
          {/* Add the tabs layout but exclude it from being in the Drawer */}
          <Drawer.Screen
            name="tabs"
            // component={TabsLayout} // This is a separate layout for your Tabs
            options={{
              drawerItemStyle: { display: 'none' },  // Hide this in the Drawer
            }}
          />
        </Drawer>
      </ThemeProvider>
    </UserProvider>
  );
}
