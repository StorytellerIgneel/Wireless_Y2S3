import React, { useState, useEffect, useContext } from 'react';
import UserContext from '@/context/UserContext';
import NotifContext from '@/context/NotifContext';
import { useRouter } from 'expo-router';
import {
  StyleSheet
} from 'react-native';
import {
  Text,
  Button,
  PageView,
  FormView,
  FormField
} from '@/components';

const styles = StyleSheet.create({
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 14
  },
  hyperlink: {
    color: "#4286F5",
    flexGrow: 1,
    textDecorationLine: "underline",
    textAlign: "right"
  },
  footer: {
    flexDirection: "row",
    marginTop: 14
  }
});

//mconst API_URL = "http://10.0.2.2:5000"; // Change if using a device (use local IP)
const API_URL = "http://192.168.1.115:5000"; //using expogo
// const API_URL = process.env.EXPO_PUBLIC_API_URL; // using expo go env

export default function Home() {
  const router = useRouter();

  // Use this approach to get username from user
  const {user, logoutUser} = useContext(UserContext);
  const { sendNotif } = useContext(NotifContext); // Get the Notif Context

  useEffect(() => {
    sendNotif("Welcome", "New to this app?"); // Send notification
  }, []);

  return (
    <PageView header="Home">
      <FormView>
        <Text>Welcome, {user ? user.username : "Guest"}!</Text>

        <Button
          title="logout"
          active
          onPress={() => {
            logoutUser(); // Clear user sessions

            router.navigate("/auth/login"); // Navigate to somewhere if needed
          }}
        />
      </FormView>
    </PageView>
  );
}