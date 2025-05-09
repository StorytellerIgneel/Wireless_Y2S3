import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import axios from 'axios';
import UserContext from '@/context/UserContext';
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

const styles = StyleSheet.create({
  error: {
    textAlign: 'center',
    marginTop: 14,
  },
  hyperlink: {
    flexGrow: 1,
    textDecorationLine: 'underline',
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 14,
  },
});

// Setup API URL depending on the platform
let API_URL;
if (Platform.OS === 'ios') {
  API_URL = 'http://localhost:5000'; // iOS Simulator
} else if (Platform.OS === 'android') {
  API_URL = 'http://10.0.2.2:5000'; // Android Emulator
} else {
  const localIp = Constants.manifest?.debuggerHost?.split(':').shift();
  API_URL = `http://${localIp}:5000`;
}

console.log('API_URL:', API_URL);

const homePath = '(tabs)/index'; 

export default function Login() {
  const router = useRouter();
  const { user, loginUser } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setUsername('');
    setPassword('');
    setStatus('');
    setMessage('');
    console.log(user ? "Logged in" : "Not logged in");
  }, []);

  const handleLogin = async () => {
    if (username === '') {
      return setMessage('Please enter username');
    } else if (password === '') {
      return setMessage('Please enter password');
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });

      loginUser({ username });
      router.replace(homePath); // Replace history to prevent going back
    } catch (error) {
      const code = error?.response?.status || 500;
      setStatus(code);

      switch (code) {
        case 401:
        case 404:
          setMessage('Please enter correct username and password');
          break;
        default:
          setMessage('Something went wrong, try again later');
      }
    }
  };

  return (
    <PageView header="Login">
      <FormView>
        <FormField
          label="Username"
          icon="person-outline"
          placeholder="Bob"
          maxLength={30}
          value={username}
          invalid={!!status || (message && !username)}
          onChangeText={setUsername}
        />
        <FormField
          hideable
          label="Password"
          icon="lock-closed-outline"
          placeholder="*****"
          maxLength={30}
          value={password}
          invalid={!!status || (message && !password)}
          onChangeText={setPassword}
        />

        <Link href="/auth/forgot-password" style={styles.hyperlink}>
          Forgot password?
        </Link>

        {!!message && (
          <Text type="error" style={styles.error}>
            {message}
          </Text>
        )}

        <Button
          title="Log in"
          type="primary"
          active={username !== '' && password !== ''}
          onPress={handleLogin}
        />
      </FormView>

      <FormFooterView>
        <Divider text="or" />

        <Button
          title="Log in with Google"
          icon="logo-google"
          type="link"
          active
          onPress={handleLogin}
        />

        <View style={styles.footer}>
          <Text style={{ opacity: 0.5 }}>Don't have an account?</Text>
          <Link href="/auth/signup" style={styles.hyperlink}>
            Create account
          </Link>
        </View>
      </FormFooterView>
    </PageView>
  );
}
