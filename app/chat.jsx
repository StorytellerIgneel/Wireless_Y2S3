<<<<<<< HEAD:app/chat.jsx
import React, { useState, useCallback, useContext } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import {View, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import UserContext from '@/context/UserContext';
=======
// ChatScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View, StyleSheet, Text } from 'react-native';
import io from 'socket.io-client';
>>>>>>> d8585695eb76b5f69f4f88e66e6f7452bf1aa656:app/chat/index.tsx

const SOCKET_URL = 'http://192.168.43.114:5000'; // Replace with your LAN IP
const socket = io(SOCKET_URL);

const ChatScreen = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);

<<<<<<< HEAD:app/chat.jsx
  //connecting to backend chat api
  const sendMessage = async (userMessage) => {
    if (!userMessage.text.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/chat`, {userInput: userMessage.text });

      console.log("res: " + res.data.response)
      const newMessage= {
        _id: String(new Date().getTime()),  // Unique ID based on timestamp
        text: String(res.data.response),   // Message from API response
        createdAt: new Date(),             // Timestamp of message creation
        user: {                            // User details
          _id: 1,                          // The user ID (current user)
          name: 'Klein',                   // The user name (current user)
=======
  // Connect and listen for responses
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    //client side socketio function to show response of gpt
    socket.on('response', (data) => {
      // console.log('📩 Server responded:', data);

      const botMessage: IMessage = {
        _id: String(new Date().getTime()),
        text: data.response,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'Gemini',
>>>>>>> d8585695eb76b5f69f4f88e66e6f7452bf1aa656:app/chat/index.tsx
        },
      };

      setMessages((prevMessages) => GiftedChat.append(prevMessages, [botMessage]));
    });

    // Clean up on unmount
    return () => {
      socket.off('response');
      socket.disconnect();
    };
  }, []);

  const sendMessage = (userMessage: IMessage) => {
    if (!userMessage.text.trim()) return;
    socket.emit('query', { userInput: userMessage.text });
  };

<<<<<<< HEAD:app/chat.jsx
  // ✅ Fix the `onSend` type issue
  const onSend = useCallback((newMessages= []) => {
    //new message refers to the latest message sent by user
=======
  const onSend = useCallback((newMessages: IMessage[] = []) => {
>>>>>>> d8585695eb76b5f69f4f88e66e6f7452bf1aa656:app/chat/index.tsx
    if (newMessages.length === 0) return;

    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    sendMessage(newMessages[0]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Chat with Gemini</Text>
      </View>
      <GiftedChat
        messages={messages}
<<<<<<< HEAD:app/chat.jsx
        onSend={(messages) => onSend(messages)} // Ensure correct function signature
        user={{ 
          _id: user?.id || 2, 
          name: user?.name || 'User',
        }} // Current user, stands for "who is reading the chat"
=======
        onSend={(messages) => onSend(messages)}
        user={{ _id: 2, name: 'You' }}
>>>>>>> d8585695eb76b5f69f4f88e66e6f7452bf1aa656:app/chat/index.tsx
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    backgroundColor: '#2E86C1',
    padding: 15,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ChatScreen;
