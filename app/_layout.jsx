import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { ThemedText } from '@/components/ThemedText'; 
import Icon from '@/components/Icon';
import { useNavigation } from '@react-navigation/native';
import Login from './auth/login';
import Welcome from './welcome';
import { UserProvider } from '@/context/UserContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

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

  if (showLogin) {
    return (
      <UserProvider>
        <Login />
      </UserProvider>
    );
  }

  return (
    <UserProvider>
      <ThemeProvider value={DefaultTheme}> {/* replace 'colorScheme === "dark" ? DarkTheme : DefaultTheme' with DefaultTheme if colorScheme is not defined */}
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: true,
            headerTitle: null,
            headerLeft: ({ navigation }) => (
              <View style={{ marginLeft: 20 }}>
                <Icon
                  name="menu"
                  size={30}
                  color="#07314A"
                  style={{ paddingLeft: 10 }}
                  onPress={() => navigation.toggleDrawer()}
                />
              </View>
            ),
            drawerIcon: () => (
              <Icon name="menu" size={30} color="#07314A" style={{ marginLeft: 20, marginRight: 20 }} />
            ),
          }}
        >
          <Drawer.Screen
            name="chat"
            options={{
              drawerLabel: () => <ThemedText type="label">Chat</ThemedText>,
              drawerIcon: () => (
                <Icon name="chatbubble-ellipses-outline" size={22} color="#07314A" />
              ),
            }}
          />

          <Drawer.Screen
            name="faq"
            options={{
              drawerLabel: () => <ThemedText type="label">FAQ</ThemedText>,
              drawerIcon: () => (
                <Icon name="help-circle-outline" size={22} color="#07314A" />
              ),
            }}
          />

          <Drawer.Screen
            name="feedback"
            options={{
              drawerLabel: () => <ThemedText type="label">Feedback</ThemedText>,
              drawerIcon: () => (
                <Icon name="chatbubbles-outline" size={22} color="#07314A" />
              ),
            }}
          />

          <Drawer.Screen
            name="profile"
            options={{
              drawerLabel: () => <ThemedText type="label">Profile</ThemedText>,
              drawerIcon: () => (
                <Icon name="person-outline" size={22} color="#07314A" />
              ),
            }}
          />

          <Drawer.Screen
            name="terms"
            options={{
              drawerLabel: () => <ThemedText type="label">Terms</ThemedText>,
              drawerIcon: () => (
                <Icon name="document-text-outline" size={22} color="#07314A" />
              ),
            }}
          />
        </Drawer>
      </ThemeProvider>
    </UserProvider>
  );
}
