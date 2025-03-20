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

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("0123456789"); // Temporary
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setStatus("");
    setMessage("");
  }, []);

  // Login function
  const handleRegister = async () => {
    if (username == "") {
        return setMessage("Please enter username");
    } else if (email == "") {
        return setMessage("Please enter e-mail");
    } else if (password == "") {
        return setMessage("Please enter password");
    }

    try {      
      const response = await axios.post(`${API_URL}/auth/register`, {
            username, 
            password, 
            email,
            phone_number: phone
        });
      
      // Create user context
      Alert.alert("Success", "Create user context");

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
          icon="mail-outline"
          maxLength={30}
          value={email}
          invalid={status || (message && !email)}
          onChangeText={setEmail} />
        <FormField
          hideable
          label="Password"
          icon="lock-closed-outline"
          maxLength={30}
          value={password}
          invalid={status || (message && !password)}
          onChangeText={setPassword} />

        <Text
          style={styles.error}>
          {message}
        </Text>
        <Button
          title="Create account"
          color="#6D787E"
          activeColor="#03314B"
          active={![username, password].includes("")}
          onPress={handleRegister} />
      </FormView>
      <FormFooterView>
        <Divider text="or" />

        <Button
          title="Create account with Google"
          icon="logo-google"
          activeColor="#4286F5"
          active
          onPress={handleRegister} />

        <View
          style={styles.footer}>
          <Text
            style={{opacity: 0.5}}>
            Already got an account?
          </Text>
          <Link
            replace
            href="/auth/login"
            style={styles.hyperlink}>
            Login
          </Link>
        </View>
      </FormFooterView>
    </PageView>
  );
}