import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEmail("");
    setStatus("");
    setMessage("");
  }, []);

  return (
    <PageView header="Reset Password">
      <FormView>
        <FormField
          label="E-mail address"
          icon="mail-outline"
          maxLength={30}
          value={email}
          invalid={status || (message && !email)}
          onChangeText={setEmail}
        />

        <Text
          style={styles.error}>
          {message}
        </Text>
        <Button
          title="Send code"
          backgroundColor="rgba(109, 120, 126, 1)"
          activeBackgroundColor="rgba(237, 180, 59, 1)"
          active={![email].includes("")}
        />
      </FormView>
    </PageView>
  );
}