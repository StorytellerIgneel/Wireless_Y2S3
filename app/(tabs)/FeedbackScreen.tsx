import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';

const FeedbackScreen = () => {
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();
  const [message, setMessage] = useState<string>();

  const onSubmit = async () => {
    if (!email || !name) {
      console.log('Email and Name are required!');
      return;
    }
    try {
      await send(
        'service_v442tdd',
        'template_yqxtmac',
        {
          name: name,
          email: email,
          message: message,
        },
        {
          publicKey: '3n8xXSvm4KPDChxv-',
        },
      );

      console.log('SUCCESS!');
    } catch (err) {
      if (err instanceof EmailJSResponseStatus) {
        console.log('EmailJS Request Failed...', err);
      }

      console.log('ERROR', err);
    }
  };

  return (
    <View>
      <TextInput style={{backgroundColor: "blue",  color: 'white'}}
        inputMode="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={{backgroundColor: "blue", color: 'white'}}
        inputMode="text"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput style={{backgroundColor: "blue", color: 'white'}}
        inputMode="text"
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Submit" onPress={onSubmit} />
    </View>
  );
};

export default FeedbackScreen;