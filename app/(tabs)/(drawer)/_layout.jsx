import { View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import { ThemedText } from '@/components/ThemedText'; 
import Icon from '@/components/Icon';

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true, // Show the header
        headerTitle: null, // No title in the header
        headerLeft: ({ navigation }) => (
          <View style={{ marginLeft: 20 }}>
            <Icon
              name="menu" // Custom burger menu icon
              size={30} // Set the size of the burger icon
              color="#07314A" // Set the color of the icon
              style={{ paddingLeft: 10 }} // Adjust padding or margin as needed
              // onPress={() => navigation.toggleDrawer()} // This toggles the drawer when the icon is pressed
            />
          </View>
        ),
        drawerIcon: () => (
          <Icon name="menu" size={30} color="#07314A" style={{ marginLeft: 20, marginRight: 20 }} />
        ), // Customizing the default burger icon for the drawer (this part could be adjusted depending on where you want the icon)
      }}
    >
      <Drawer.Screen
        name="chat"
        options={{
          drawerLabel: () => <ThemedText type="label">Chat</ThemedText>, // Apply ThemedText to drawerLabel
          drawerIcon: () => (
            <Icon name="chatbubble-ellipses-outline" size={22} color="#07314A" /> // Custom icon styling
          ),
        }}
      />

      <Drawer.Screen
        name="faq"
        options={{
          drawerLabel: () => <ThemedText type="label">FAQ</ThemedText>, // Apply ThemedText to drawerLabel
          drawerIcon: () => (
            <Icon name="help-circle-outline" size={22} color="#07314A" /> // Custom icon styling
          ),
        }}
      />

      <Drawer.Screen
        name="feedback"
        options={{
          drawerLabel: () => <ThemedText type="label">Feedback</ThemedText>, // Apply ThemedText to drawerLabel
          drawerIcon: () => (
            <Icon name="chatbubbles-outline" size={22} color="#07314A" /> // Custom icon styling
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: () => <ThemedText type="label">Profile</ThemedText>, // Apply ThemedText to drawerLabel
          drawerIcon: () => (
            <Icon name="person-outline" size={22} color="#07314A" /> // Custom icon styling
          ),
        }}
      />

      <Drawer.Screen
        name="terms"
        options={{
          drawerLabel: () => <ThemedText type="label">Terms</ThemedText>, // Apply ThemedText to drawerLabel
          drawerIcon: () => (
            <Icon name="document-text-outline" size={22} color="#07314A" /> // Custom icon styling
          ),
        }}
      />
    </Drawer>
  );
}
