// ChatScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View, StyleSheet, Text, Platform } from 'react-native';
import Constants from 'expo-constants';
import io from 'socket.io-client';
import {
  PageView,
} from "@/components";

// const SOCKET_URL = 'http://192.168.1.22:5000'; // Replace with your LAN IP
// const SOCKET_URL = 'http://192.168.43.114:5000'; // Replace with your LAN IP
// Setup API URL depending on the platform
let SOCKET_URL;
if (Platform.OS === 'ios') {
  SOCKET_URL = 'http://localhost:5000'; // iOS Simulator
} else if (Platform.OS === 'android') {
  SOCKET_URL = 'http://10.0.2.2:5000'; // Android Emulator
} else {
  const localIp = Constants.manifest?.debuggerHost?.split(':').shift();
  SOCKET_URL = `http://${localIp}:5000`;
}

const socket = io(SOCKET_URL);

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);

  // Connect and listen for responses
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    //client side socketio function to show response of gpt
    socket.on('response', (data) => {
      // console.log('📩 Server responded:', data);

      const botMessage = {
        _id: String(new Date().getTime()),
        text: data.response,
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'Gemini',
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

  const sendMessage = (userMessage) => {
    if (!userMessage.text.trim()) return;
    socket.emit('query', { userInput: userMessage.text });
  };

  const onSend = useCallback((newMessages = []) => {
    if (newMessages.length === 0) return;

    setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
    sendMessage(newMessages[0]);
  }, []);

  return (
    <>
      <PageView header="Chat with Gemini" type="back" />
      <View style={styles.container}>
          <GiftedChat
            style={styles.container}
            messages={messages}
            onSend={(messages) => onSend(messages)}
            user={{ _id: 2, name: 'You' }}
          />
        </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 5 },
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
