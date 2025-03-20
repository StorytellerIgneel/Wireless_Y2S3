import React, { useState, useEffect } from 'react';
import PageView from '../../components/PageView';
import FormView from '../../components/FormView';
import FormFooterView from '../../components/FormFooterView';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import Divider from '../../components/Divider';
import { Link } from 'expo-router';
import axios from 'axios';
import {
  View,
  Text,
  Alert,
  StyleSheet
} from 'react-native';

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

//mconst API_URL = "http://10.0.2.2:5000"; // Change if using a device (use local IP)
const API_URL = "http://192.168.1.115:5000"; //using expogo

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("First render");

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

  // Register function
  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { 
        username, 
        password, 
        email, 
        phone_number: phone 
      });
      Alert.alert("Success", response.data.response);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.response || "Something went wrong");
    }
  };

  return (
    <PageView header="Create Account">
      <FormView>
        <FormField
          label="Username"
          icon="person-outline"
          maxLength={30}
          value={username}
          invalid={status || (message && !username)}
          onChangeText={setUsername} />
        <FormField
          label="E-mail address"
          icon="email-outline"
          maxLength={30}
          value={username}
          invalid={status || (message && !username)}
          onChangeText={setUsername} />
        <FormField
          hideable
          label="Password"
          icon="lock-closed-outline"
          maxLength={30}
          value={password}
          invalid={status || (message && !password)}
          onChangeText={setPassword} />

        <Link
          href="/auth/forgot-password"
          style={styles.hyperlink}>
          Forgot password?
        </Link>

        <Text
          style={styles.error}>
          {message}
        </Text>
        <Button
          title="Log in"
          color="#6D787E"
          activeColor="#03314B"
          active={![username, password].includes("")}
          onPress={handleLogin} />
      </FormView>
      <FormFooterView>
        <Divider text="or" />

        <Button
          title="Log in with Google"
          icon="logo-google"
          activeColor="#4286F5"
          active
          onPress={handleLogin} />

        <View
          style={styles.footer}>
          <Text
            style={{opacity: 0.5}}>
            Don't have an account?
          </Text>
          <Link
            href="/auth/signup"
            style={styles.hyperlink}>
            Create account
          </Link>
        </View>
      </FormFooterView>
    </PageView>
  );
}