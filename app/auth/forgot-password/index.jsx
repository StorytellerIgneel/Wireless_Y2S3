import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

import {
  Text,
  Link,
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
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setEmail('');
    setStatus('');
    setMessage('');
  }, []);

  const validEmail = (value) => {
    value = value.trim();

    if (value.match(/^[a-zA-Z0-9\.]{3,}@[a-zA-Z0-9]+\.[a-zA-Z]+$/)) return true;

    if (value === "") {
      setMessage("Please enter e-mail");
    } else {
      setMessage("Please enter valid e-mail");
    }

    return false;
  };

  // Recover password
  const handleEmail = async () => {
    setMessage('');

    const isEmailValid = validEmail(email);

    if (!isEmailValid) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/recover_password`, {
        email
      });

      const code = response.status;
      setStatus(code);

      router.navigate({
        pathname: "/auth/forgot-password/code-verification",
        params: { email }
      });

    } catch (error) {
      const code = error?.response?.status;
      setStatus(code);

      switch (code) {
        case 400:
        case 404:
          setMessage("Please enter a registered e-mail");
          break;
        default:
          setMessage("Something went wrong, try again later");
      }
    }
  }

  return (
    <PageView header="Reset Password" type="back">
      <Text type="block">We just need your registered email address to reset your password</Text>
      
      <FormView>
        <FormField
          label="E-mail address"
          icon="mail-outline"
          maxLength={30}
          value={email}
          invalid={(!!status && status != 200) || message.toLowerCase().includes("mail")}
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
          onPress={handleEmail}
        />
      </FormView>
    </PageView>
  );
}
