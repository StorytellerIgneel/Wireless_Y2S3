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

  const { email, code } = useLocalSearchParams();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setPassword('');
    setConfirmPassword('');
    setStatus('');
    setMessage('');
  }, []);

  const validPassword = (value1, value2) => {
    if (value1 === value2 && value1 !== '') return true;

    if (value1 === '')
        setMessage("Please enter new password");
    else if (value2 === '')
        setMessage("Please enter confirmation password");
    else
        setMessage("Passwords are not match");

    return false;
  };

  // Password function
  const handlePassword = async () => {
    setMessage('');

    const isPasswordValid = validPassword(password, confirmPassword);

    if (!isPasswordValid) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/reset_password`, {
        email: email,
        code: code,
        password: password
      });

      alert("Your password has been reset");

      router.replace("/auth/login");

    } catch (error) {
      const code = error?.response?.status || 500;
      setStatus(code);

      console.log(error.response)

      switch (code) {
        case 400:
        case 401:
        case 404:
          setMessage('Please enter correct recovery code');
          break;
         case 409:
          setMessage('New password cannot be same as previous password');
          break;
        default:
          setMessage('Something went wrong, try again later');
      }
    }
  }

  return (
    <PageView header="Reset Password" type="back">
      <Text type="block">Please enter a new password</Text>
      
      <FormView>
        <FormField
            hideable
            label="New Password"
            icon="lock-closed-outline"
            placeholder="*****"
            maxLength={30}
            value={password}
            invalid={!!status || message.toLowerCase().includes("password")}
            onChangeText={setPassword}
        />

        <FormField
            hideable
            label="Confirm Password"
            icon="lock-closed-outline"
            placeholder="*****"
            maxLength={30}
            value={confirmPassword}
            invalid={!!status || message.toLowerCase().includes("password")}
            onChangeText={setConfirmPassword}
        />

        {!!message && (
          <Text style={styles.error}>
            {message}
          </Text>
        )}

        <Button
          title={"Reset"}
          type="primary"
          active={![password, confirmPassword].includes("")}
          onPress={handlePassword}
        />
      </FormView>
    </PageView>
  );
}
