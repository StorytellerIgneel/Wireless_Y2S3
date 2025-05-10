// ChatScreen.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { View, StyleSheet, Text } from 'react-native';
import io from 'socket.io-client';

const SOCKET_URL = 'http://192.168.43.114:5000'; // Replace with your LAN IP
const socket = io(SOCKET_URL);

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

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

  const onSend = useCallback((newMessages: IMessage[] = []) => {
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
        onSend={(messages) => onSend(messages)}
        user={{ _id: 2, name: 'You' }}
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
