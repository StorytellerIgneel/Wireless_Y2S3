import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Platform } from 'react-native';
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
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setEmail('');
    setStatus('');
    setMessage('');
  }, []);

  useEffect(() => {
    if (timer > 0)
      setTimeout(() => setTimer(n => n - 1), 1000);
  }, [timer]);

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

  // Resend function
  const handleSend = async () => {
    if (timer > 0)
      return;

    setTimer(30);

    try {
      const response = await axios.post(`${API_URL}/auth/recover_password`, {
        email
      });

      const code = response.status;
      setStatus(code);

      console.log(response);
    } catch (error) {
      const code = error?.response?.status;
      setStatus(code);

      switch (code) {
        case 400:
        case 404:
          setMessages(["Please enter a registered e-mail"]);
          break;
        default:
          setMessages(["Something went wrong, try again later"]);
      }
    }
  }

  // Recover password
  const handleEmail = async () => {
    setMessage('');

    const isEmailValid = validEmail(email);

    if (!isEmailValid) {
      return;
    }

    handleSend();
  }

  return (
    <PageView header="Reset Password">
      {status != 200 ? (
        <Text type="block">We just need your registered email address to reset your password</Text>
      ) : (
        <Text type="block">We have sent a password recovery link to <Text type="bold">{email}</Text></Text>
      )}
      
      <FormView>
        <FormField
          label="E-mail address"
          icon="mail-outline"
          maxLength={30}
          value={email}
          editable={status != 200 || timer == 0}
          invalid={(!!status && status != 200) || message.toLowerCase().includes("mail")}
          onChangeText={setEmail}
        />

        {!!message && (
          <Text style={styles.error}>
            {message}
          </Text>
        )}

        {status != 200 ? (
          <Button
            title="Send code"
            type="primary"
            active={email.trim() !== ''}
            onPress={handleEmail}
          />
        ) : (
          <Button
            title={timer == 0 ? "Resend" : `Sent (${timer})`}
            type="primary"
            active={timer == 0}
            onPress={handleSend}
          />
        )}
      </FormView>
    </PageView>
  );
}
