import React, { useState, useEffect } from 'react';
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
// const API_URL = process.env.EXPO_PUBLIC_API_URL; // using expo go env
const homePath = "/demo-user-context/home";

export default function Signup() {
  const router = useRouter();

  const {user, loginUser} = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("0123456789"); // Temporary
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setStatus("");
    setMessages([]);
  }, []);

  const validUsername = (value) => {
    value = value.trim();

    if (value.match(/^[a-zA-z0-9]+$/))
      return true;

    if (value == "") {
      setMessages(msgs => ["Please enter username", ...msgs]);
    } else if (value.match(/\s/)) {
      setMessages(msgs => ["Username should not contain space(\" \")", ...msgs]);
    }

    return false;
  };

  const validEmail = (value) => {
    value = value.trim();

    if (value.match(/^[a-zA-Z0-9]{3,}@[a-zA-Z]+\.[a-zA-Z]+$/))
      return true;

    if (value == "") {
      setMessages(msgs => ["Please enter e-mail", ...msgs]);
    } else {
      setMessages(msgs => ["Please enter valid e-mail", ...msgs]);
    }

    return false;
  }

  const validPassword = (value) => {
    if (value != "")
      return true;

    setMessages(msgs => ["Please enter password", ...msgs]);

    return false;
  }

  // Login function
  const handleRegister = async () => {
    setMessages([]);

    validPassword(password);
    validEmail(email);
    validUsername(username);
    
    if (!messages.length > 0) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
            username, 
            password, 
            email,
            phone_number: phone
        });
      
      // Create user context
      loginUser({ username: username });

      router.navigate(homePath);

    } catch (error) {
      const code = error.response.status;

      setStatus(code);

      switch(code) {
        case 409:
          setMessage("Username already exists");
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
          placeholder="Bob"
          maxLength={30}
          value={username}
          invalid={status || messages.find(msg => msg.match(/username/i))}
          onChangeText={setUsername}
        />
        <FormField
          label="E-mail address"
          icon="mail-outline"
          placeholder="bookworm@gmail.com"
          maxLength={30}
          value={email}
          invalid={status || messages.find(msg => msg.match(/e(\-)?mail/i))}
          onChangeText={setEmail}
        />
        <FormField
          hideable
          label="Password"
          icon="lock-closed-outline"
          placeholder="*****"
          maxLength={30}
          value={password}
          invalid={status || messages.find(msg => msg.match(/password/i))}
          onChangeText={setPassword}
        />

        <Text type="error" style={styles.error}>{messages[0]}</Text>
        <Button
          title="Create account"
          type="primary"
          active={![username, email, password].includes("")}
          onPress={handleRegister}
        />
      </FormView>
      <FormFooterView>
        <Divider text="or" />

        <Button
          title="Create account with Google"
          icon="logo-google"
          type="link"
          active
          onPress={handleRegister}
        />

        <View style={styles.footer}>
          <Text style={{opacity: 0.5}}>
            Already got an account?
          </Text>
          <Link
            href="/auth/login"
            style={styles.hyperlink}>
            Login
          </Link>
        </View>
      </FormFooterView>
    </PageView>
  );
}