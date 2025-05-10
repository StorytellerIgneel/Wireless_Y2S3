import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useLocalSearchParams, useRouter } from 'expo-router';

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

export default function CodeRecovery() {
  const router = useRouter();

  const { email } = useLocalSearchParams();

  const [recoveryCode, setRecoveryCode] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setRecoveryCode('');
    setStatus('');
    setMessage('');

    handleSend(); // Trigger send for the first time page being loaded
  }, []);

  useEffect(() => {
    if (timer > 0)
      setTimeout(() => setTimer(n => n - 1), 1000);
  }, [timer]);

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
          setMessage("Please enter a registered e-mail");
          break;
        default:
          setMessage("Something went wrong, try again later");
      }
    }
  }

  // Recovery code function
  const handleCode = async () => {
    setMessage('');

    try {
      const response = await axios.post(`${API_URL}/auth/verify_code`, {
        email: email,
        code: recoveryCode,
      });

      router.navigate({
        pathname: "/auth/forgot-password/reset",
        params: {
          email: email,
          code: recoveryCode
        }
      })
    } catch (error) {
      const code = error?.response?.status || 500;
      setStatus(code);

      switch (code) {
        case 400:
        case 401:
          setMessage('Please enter correct recovery code');
          break;
        default:
          setMessage('Something went wrong, try again later');
      }
    }
  }

  return (
    <PageView header="Reset Password">
      <Text type="block">We have sent a recovery code to <Text type="bold">{email}</Text></Text>
      
      <FormView>
        <FormField
          label="Recovery code"
          icon="key-outline"
          maxLength={6}
          value={recoveryCode}
          keyboardType="numeric"
          invalid={(!!status && status != 200) || message.toLowerCase().includes("code")}
          onChangeText={setRecoveryCode}
        />

        {!!message && (
          <Text style={styles.error}>
            {message}
          </Text>
        )}

        <Button
          title={"Reset password"}
          type="primary"
          active={recoveryCode.trim() != ''}
          onPress={handleCode}
        />
        <Button
          title={timer == 0 ? "Resend code" : `Sent (${timer})`}
          type="link"
          active={timer == 0}
          onPress={handleSend}
        />
      </FormView>
    </PageView>
  );
}
