import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { send, EmailJSResponseStatus } from '@emailjs/react-native';
import axios from 'axios';

//const API_URL = "http://10.0.2.2:5000"; // Change if using a device (use local IP)
const API_URL = "http://192.168.43.114:8081"; //using expogo

const FeedbackScreen = () => {
  const [ID, setID] = useState<string>();
  const [type, setType] = useState<string>();
  const [subject, setSubject] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [user_email, setUserEmail] = useState<string>();
  const [response, setResponse] = useState<string>();

  const handleFeedback = async () => {
    try {
      const response = await axios.post(`${API_URL}/feedback/feedback`, {
        user_id: ID,
        type: type,
        description: message
      });
      console.log(response.data);
      setResponse(response.data.response);
      setUserEmail(response.data.user_email);
      console.log(user_email);
    }catch (err) {
        console.log('ERROR', err);
      }
    };
      
  const onSubmit = async () => {
    if (!type) { //subejct can be left empty
      console.log('Email and subject are required!');
      return;
    }
    try{
      const backendSuccess  = await handleFeedback();
      if (response === "Feedback submitted successfully") {
        await send(
          'service_v442tdd',
          'template_yqxtmac',
          {
            email: user_email,
            subject: subject,
            type: type,
            message: message,
          },
          {
            publicKey: '3n8xXSvm4KPDChxv-',
          },)
      };
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
        keyboardType="numeric"
        placeholder="id"
        value={ID}
        onChangeText={setID}
      />
      <TextInput style={{backgroundColor: "blue",  color: 'white'}}
        inputMode="text"
        keyboardType="default"
        placeholder="type"
        value={type}
        onChangeText={setType}
      />
      <TextInput style={{backgroundColor: "blue", color: 'white'}}
        inputMode="text"
        placeholder="subject"
        value={subject}
        onChangeText={setSubject}
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