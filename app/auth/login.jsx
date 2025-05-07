import React, { useState, useEffect, useContext } from 'react';
import UserContext from '@/context/UserContext';
import { useRouter } from 'expo-router';
import axios from 'axios';
import {
  View,
  Alert,
  StyleSheet
} from 'react-native';
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

//const API_URL = "http://10.0.2.2:5000"; // Change if using a device (use local IP)
const API_URL = "http://192.168.1.115:5000"; //using expogo
// const API_URL = process.env.EXPO_PUBLIC_API_URL; // using expo go env
const homePath = "/demo-user-context/home";

export default function Login() {
  const router = useRouter();

  const {user, loginUser} = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUsername("");
    setPassword("");
    setStatus("");
    setMessage("");
  }, []);

  // Login function
  const handleLogin = async () => {
    if (username == "") {
      return setMessage("Please enter username");
    } else if (password == "") {
      return setMessage("Please enter password");
    }

    try {      
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      
      // Create user context
      loginUser({ username: username });

      router.navigate(homePath);

    } catch (error) {
      const code = error.response.status;

      setStatus(code);

      switch(code) {
        case 401:
        case 404:
          setMessage("Please enter correct username and password");
          break;
        default:
          setMessage("Soemthing went wrong, try again later");
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
          invalid={status || (message && !username)}
          onChangeText={setUsername}
        />
        <FormField
          hideable
          label="Password"
          icon="lock-closed-outline"
          placeholder="*****"
          maxLength={30}
          value={password}
          invalid={status || (message && !password)}
          onChangeText={setPassword}
        />

        <Link
          href="/auth/forgot-password"
          style={styles.hyperlink}
        >
          Forgot password?
        </Link>

        <Text type="error" style={styles.error}>{message}</Text>
        
        <Button
          title="Log in"
          type="primary"
          active={![username, password].includes("")}
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
          <Text style={{opacity: 0.5}}>
            Don't have an account?
          </Text>
          <Link
            href="/auth/signup"
            style={styles.hyperlink}
          >
            Create account
          </Link>
        </View>
      </FormFooterView>
    </PageView>
  );
}