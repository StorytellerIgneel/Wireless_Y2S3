import React, { useContext } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import UserContext from '@/context/UserContext';

export default function CustomDrawerContent(props) {
  // Safely destructure user and logoutUser from the context with fallback values
  const { user = {}, logoutUser } = useContext(UserContext) || {};

  const handleLogout = () => {
    logoutUser();
    props.navigation.navigate('auth'); // Or 'index' depending on your routes
  };

  // Destructure the user object with default values for name and email
  const userName = user?.name || 'Guest';
  const userEmail = user?.email || 'Not logged in';

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <TouchableOpacity onPress={() => props.navigation.navigate('profile')}>
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/default-profile.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{userName}</Text>
          <Text style={styles.email}>{userEmail}</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>

      <View style={styles.footer}>
        <DrawerItem
          label="Log Out"
          onPress={handleLogout}
          icon={({ color, size }) => (
            <Ionicons name="log-out-outline" size={size} color={color} />
          )}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
    backgroundColor: '#ccc',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: '#777',
  },
  menu: {
    flex: 1,
    paddingTop: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingBottom: 10,
  },
});
