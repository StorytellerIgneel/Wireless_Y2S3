import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';

const FeedbackScreen = () => {
  const [email, setEmail] = useState<string>();
  const [name, setName] = useState<string>();

  const onSubmit = async () => {
    try {
      await send(
        'service_v442tdd',
        'template_yqxtmac',
        {
          name,
          email,
          message: 'This is a static message',
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
      <TextInput style={{color: 'white'}}
        inputMode="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={{color: 'white'}}
        inputMode="text"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Submit" onPress={onSubmit} />
    </View>
  );
};

export default FeedbackScreen;