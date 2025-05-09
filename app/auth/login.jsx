import React, { useState, useEffect, useContext } from 'react';
import { View, Alert, StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useRouter, Redirect } from 'expo-router';
import axios from 'axios';
import UserContext from '@/context/UserContext';
import {
  Text,
  Link,
  Button,
  Checkbox,
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

<<<<<<< HEAD
const homePath = '(tabs)/index'; 

export default function Login() {
  const router = useRouter();
  const { user, loginUser } = useContext(UserContext);
=======
const homePath = '/demo-user-context/home';

export default function Login() {
  const router = useRouter();
  const { user, loginUser, saveUser } = useContext(UserContext);

>>>>>>> d8585695eb76b5f69f4f88e66e6f7452bf1aa656
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');

  useEffect(async () => {
    setUsername('');
    setPassword('');
    setRememberMe(false);
    setStatus('');
    setMessage('');
<<<<<<< HEAD
    console.log(user ? "Logged in" : "Not logged in");
=======

    const { GoogleSignin } = await import('@react-native-google-signin/google-signin');

    GoogleSignin.configure({
      iosClientId: "143395840986-03hj8l1a6gjntgq4pmv0q00atus6kmau.apps.googleusercontent.com",
      webClientId: "143395840986-ef5dvc0p50d3ofc00tnbjcnl0b7qe06h.apps.googleusercontent.com",
      profileImageSize: 150,
    })
>>>>>>> d8585695eb76b5f69f4f88e66e6f7452bf1aa656
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

<<<<<<< HEAD
      loginUser({ username });
      router.replace(homePath); // Replace history to prevent going back
=======
      loginUser({
        username: username,
        email: response.data.email,
        phone: response.data.phone
      });

      if (rememberMe) {
        saveUser({
          username: username,
          email: response.data.email,
          phone: response.data.phone,
          password: password
        });
      }
>>>>>>> d8585695eb76b5f69f4f88e66e6f7452bf1aa656
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

  const handleGoogle = async () => {
    try {
      const { GoogleSignin, isSuccessResponse, isErrorWithCode, statusCodes } = await import( "@react-native-google-signin/google-signin");

      await GoogleSignin.hasPlayServices();

      const res = await GoogleSignin.signIn();

      if (isSuccessResponse(res)) {
        const { idToken, user } = res.data;
        const { name, email, photo } = user;

        loginUser({
          username: name,
          email: email
        });
      } else {
        console.log(res);
      }
    } catch (err) {
      console.log(res);
    }
  }

  if (user)
    return <Redirect href={homePath} />

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

        <Checkbox
          label="Remember Me"
          value={rememberMe}
          onValueChange={setRememberMe}
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
          onPress={handleGoogle}
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
