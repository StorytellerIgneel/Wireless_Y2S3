import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  StyleSheet
} from 'react-native';
import {
  Text,
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

//mconst API_URL = "http://10.0.2.2:5000"; // Change if using a device (use local IP)
const API_URL = "http://192.168.1.115:5000"; //using expogo
// const API_URL = process.env.EXPO_PUBLIC_API_URL; // using expo go env

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setEmail("");
    setStatus("");
    setMessage("");
  }, []);

  //
  const handleEmail = () => {

  }

  return (
    <PageView header="Reset Password">
      <FormView>
        <FormField
          label="E-mail address"
          icon="mail-outline"
          maxLength={30}
          value={email}
          invalid={status || (message && !email)}
          onChangeText={setEmail}
        />

        <Text
          style={styles.error}>
          {message}
        </Text>
        <Button
          title="Send code"
          type="primary"
          active={![email].includes("")}
          onPress={handleEmail}
        />
      </FormView>
    </PageView>
  );
}