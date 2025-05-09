import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import {
  View,
  StyleSheet,
  Platform
} from 'react-native';
import Constants from 'expo-constants';
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

let API_URL;
if (Platform.OS === 'ios') {
  API_URL = `http://localhost:5000`;
} else if (Platform.OS === 'android') {
  API_URL = `http://10.0.2.2:5000`;
} else {
  const localIp = Constants.manifest.debuggerHost.split(':').shift();
  API_URL = `http://${localIp}:5000`;
}

const homePath = "/demo-user-context/home";

export default function Signup() {
  const router = useRouter();
  const { user, loginUser } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setStatus("");
    setMessages([]);
  }, []);

  const validUsername = (value) => {
    value = value.trim();

    if (value.match(/^[a-zA-Z0-9]+$/)) return true;

    if (value === "") {
      setMessages(msgs => ["Please enter username", ...msgs]);
    } else if (value.match(/\s/)) {
      setMessages(msgs => ["Username should not contain space(\" \")", ...msgs]);
    } else {
      setMessages(msgs => ["Invalid username format", ...msgs]);
    }

    return false;
  };

  const validEmail = (value) => {
    value = value.trim();

    if (value.match(/^[a-zA-Z0-9\.]{3,}@[a-zA-Z0-9]+\.[a-zA-Z]+$/)) return true;

    if (value === "") {
      setMessages(msgs => ["Please enter e-mail", ...msgs]);
    } else {
      setMessages(msgs => ["Please enter valid e-mail", ...msgs]);
    }

    return false;
  };

  const validPhone = (value) => {
    value = value.trim();

    if (value.match(/^(01[02-46-9][0-9]{7}|01[1][0-9]{8})$/)) return true;

    if (value === "") {
      setMessages(msgs => ["Please enter phone number", ...msgs]);
    } else {
      setMessages(msgs => ["Please enter valid phone number", ...msgs]);
    }

    return false;
  };

  const validPassword = (value1, value2) => {
    if (value1 === value2 && value1 !== '') return true;

    if (value1 === '')
      setMessages(msgs => ["Please enter password", ...msgs]);
    else if (value2 === '')
      setMessages(msgs => ["Please enter confirmation password", ...msgs]);
    else
      setMessages(msgs => ["Passwords are not match", ...msgs]);

    return false;
  };

  const handleRegister = async () => {
    setMessages([]);

    const isUsernameValid = validUsername(username);
    const isEmailValid = validEmail(email);
    const isPhoneValid = validPhone(phone);
    const isPasswordValid = validPassword(password, confirmPassword);

    if (!(isUsernameValid && isEmailValid && isPhoneValid && isPasswordValid)) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
        email,
        phone_number: phone
      });

      loginUser({
        username: username,
        email: email,
        phone: phone
      });
    } catch (error) {
      const code = error?.response?.status;
      setStatus(code);

      switch (code) {
        case 409:
          setMessages([error.response.data.response.split(/\s*\:\s*/)[1]]);
          break;
        default:
          setMessages(["Something went wrong, try again later"]);
      }
    }
  };

  if (user)
      return <Redirect href={homePath} />

  return (
    <PageView header="Create Account">
      <FormView>
        <FormField
          label="Username"
          icon="person-outline"
          placeholder="Bob"
          maxLength={30}
          value={username}
          invalid={messages.find(msg => msg.toLowerCase().includes("username"))}
          onChangeText={setUsername}
        />
        <FormField
          label="E-mail address"
          icon="mail-outline"
          placeholder="bookworm@gmail.com"
          maxLength={30}
          value={email}
          invalid={messages.find(msg => msg.toLowerCase().includes("mail"))}
          onChangeText={setEmail}
        />
        <FormField
          label="Phone number"
          icon="call-outline"
          placeholder="0123338888"
          maxLength={11}
          value={phone}
          keyboardType="numeric"
          invalid={messages.find(msg => msg.toLowerCase().includes("phone"))}
          onChangeText={setPhone}
        />
        <FormField
          hideable
          label="Password"
          icon="lock-closed-outline"
          placeholder="*****"
          maxLength={30}
          value={password}
          invalid={messages.find(msg => msg.toLowerCase().includes("password"))}
          onChangeText={setPassword}
        />
        <FormField
          hideable
          label="Confirm password"
          icon="lock-closed-outline"
          placeholder="*****"
          maxLength={30}
          value={confirmPassword}
          invalid={messages.find(msg => msg.toLowerCase().includes("password"))}
          onChangeText={setConfirmPassword}
        />

        <Text type="error" style={styles.error}>{messages[0]}</Text>

        <Button
          title="Create account"
          type="primary"
          active={![username, email, phone, password, confirmPassword].includes("")}
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
          <Text style={{ opacity: 0.5 }}>
            Already got an account?
          </Text>
          <Link
            href="/auth/login"
            style={styles.hyperlink}
          >
            Login
          </Link>
        </View>
      </FormFooterView>
    </PageView>
  );
}
