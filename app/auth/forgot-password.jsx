import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  StyleSheet
} from 'react-native';
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

//mconst API_URL = "http://10.0.2.2:5000"; // Change if using a device (use local IP)
const API_URL = "http://192.168.1.115:5000"; //using expogo
// const API_URL = process.env.EXPO_PUBLIC_API_URL; // using expo go env

export default function ForgotPassword() {
<<<<<<< Updated upstream
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
=======
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);
>>>>>>> Stashed changes

  useEffect(() => {
    setEmail("");
    setStatus("");
    setMessage("");
  }, []);

<<<<<<< Updated upstream
  //
  const handleEmail = () => {

=======
  useEffect(() => {
    if (timer > 0)
      setTimeout(() => setTimer(n => n - 1), 1000);
  }, [timer]);

  const validEmail = (value) => {
    value = value.trim();

    if (value.match(/^[a-zA-Z0-9\.]{3,}@[a-zA-Z0-9]+\.[a-zA-Z]+$/)) return true;

    if (value === "") {
      setMessage("Please enter e-mail");
    } else {
      setMessage("Please enter valid e-mail");
    }

    return false;
  };

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
          setMessages(["Please enter a registered e-mail"]);
          break;
        default:
          setMessages(["Something went wrong, try again later"]);
      }
    }
  }

  // Recover password
  const handleEmail = async () => {
    setMessage('');

    const isEmailValid = validEmail(email);

    if (!isEmailValid) {
      return;
    }

    handleSend();
>>>>>>> Stashed changes
  }

  return (
    <PageView header="Reset Password">
      {status != 200 ? (
        <Text type="block">We just need your registered email address to reset your password</Text>
      ) : (
        <Text type="block">We have sent a password recovery link to <Text type="bold">{email}</Text></Text>
      )}
      
      <FormView>
        <FormField
          label="E-mail address"
          icon="mail-outline"
          maxLength={30}
          value={email}
<<<<<<< Updated upstream
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
=======
          editable={status != 200 || timer == 0}
          invalid={(!!status && status != 200) || message.toLowerCase().includes("mail")}
          onChangeText={setEmail}
        />

        {!!message && (
          <Text style={styles.error}>
            {message}
          </Text>
        )}

        {status != 200 ? (
          <Button
            title="Send code"
            type="primary"
            active={email.trim() !== ''}
            onPress={handleEmail}
          />
        ) : (
          <Button
            title={timer == 0 ? "Resend" : `Sent (${timer})`}
            type="primary"
            active={timer == 0}
            onPress={handleSend}
          />
        )}
>>>>>>> Stashed changes
      </FormView>
    </PageView>
  );
}