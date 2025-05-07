import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { View, StyleSheet, Alert } from 'react-native';

import {
  Text,
  Link,
  Button,
  Divider,
  PageView,
  FormView,
  FormFooterView,
  FormField
} from '@/components';

import UserContext from '@/context/UserContext';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

let API_URL;

if (Platform.OS === 'ios') {
  API_URL = `http://localhost:5000`; // iOS Simulator
} else if (Platform.OS === 'android') {
  API_URL = `http://10.0.2.2:5000`; // Android Emulator
} else {
  const localIp = Constants.manifest.debuggerHost.split(':').shift(); // Physical device
  API_URL = `http://${localIp}:5000`;
}

console.log(API_URL); // Check API URL used

//mconst API_URL = "http://10.0.2.2:5000"; // Change if using a device (use local IP)
// const API_URL = "http://192.168.1.115:5000"; //using expogo

const styles = StyleSheet.create({
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 14
  },
  hyperlink: {
    flexGrow: 1,
    textDecorationLine: "underline",
    textAlign: "right"
  },
  footer: {
    flexDirection: "row",
    marginTop: 14
  }
});

export default function Login() {
  const router = useRouter();
  const context = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (context?.user) {
      router.replace("/"); // redirect to home if user already logged in
    }
  }, [context?.user]);

  console.log("context.user on login screen:", context.user);

  useEffect(() => {
    setUsername("");
    setPassword("");
    setMessage("");
  }, []);

  const handleLogin = async () => {
    console.log("Login button clicked");

    if (!username) return setMessage("Please enter username");
    if (!password) return setMessage("Please enter password");

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });

      console.log("Login success:", response.data);

      const userInfo = {
        name: username,
        email: `${username}@example.com`,
      };

      if (!context) {
        console.error("UserContext is undefined");
        return;
      }

      context.loginUser(userInfo); // this must not be undefined
      // Create user context
      // Alert.alert("Success", "Create user context");

      // Simulated user info — replace with real response if your backend returns user data
      router.replace('/');
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Please check credentials or try again later.");
    }
  };

  // Prevent flashing login screen if already authenticated
  if (context?.user) return null;

  return (
    <PageView header="Login">
      <FormView>
        <FormField
          label="Username"
          icon="person-outline"
          placeholder="Bob"
          value={username}
          onChangeText={setUsername}
        />
        <FormField
          hideable
          label="Password"
          icon="lock-closed-outline"
          placeholder="*****"
          value={password}
          onChangeText={setPassword}
        />

        <Link href="/auth/forgot-password" style={styles.hyperlink}>
          Forgot password?
        </Link>

        <Text style={styles.error}>{message}</Text>

        <Button
          title="Log in"
          backgroundColor="rgba(109, 120, 126, 1)"
          activeBackgroundColor="rgba(237, 180, 59, 1)"
          active={![username, password].includes("")}
          onPress={handleLogin}
        />
      </FormView>

      <FormFooterView>
        <Divider text="or" />

        <Button
          title="Log in with Google"
          icon="logo-google"
          activeBackgroundColor="rgba(66, 134, 245, 1)"
          activeColor="rgba(255, 255, 255, 1)"
          onPress={() => Alert.alert("Not implemented")}
        />

        <View style={styles.footer}>
          <Text style={{ opacity: 0.5 }}>
            Don't have an account?
          </Text>
          <Link href="/auth/signup" style={styles.hyperlink}>
            Create account
          </Link>
        </View>
      </FormFooterView>
    </PageView>
  );
}
