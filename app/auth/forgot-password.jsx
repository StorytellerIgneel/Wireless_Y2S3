import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';

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

// Determine API URL based on platform
let API_URL;

if (Platform.OS === 'ios') {
  API_URL = `http://localhost:5000`; // iOS simulator
} else if (Platform.OS === 'android') {
  API_URL = `http://10.0.2.2:5000`; // Android emulator
} else {
  const localIp = Constants.manifest.debuggerHost?.split(':').shift();
  API_URL = `http://${localIp}:5000`;
}

console.log('API_URL:', API_URL);

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setEmail('');
    setStatus('');
    setMessage('');
  }, []);

  return (
    <PageView header="Reset Password">
      <FormView>
        <FormField
          label="E-mail address"
          icon="mail-outline"
          maxLength={30}
          value={email}
          invalid={!!status || (message && !email)}
          onChangeText={setEmail}
        />

        {!!message && (
          <Text style={styles.error}>
            {message}
          </Text>
        )}

        <Button
          title="Send code"
          type="primary"
          active={email.trim() !== ''}
          onPress={() => {
            // Handle sending code here
            console.log("Send code clicked with email:", email);
          }}
        />
      </FormView>
    </PageView>
  );
}
