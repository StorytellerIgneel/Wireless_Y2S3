import React, { useState, useCallback, useContext } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import {View, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import UserContext from '@/context/UserContext';

const API_URL = 'http://10.0.2.2:5000';
// const API_URL = 'http://192.168.43.114:8081';

const ChatScreen = () => {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);

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
        },
      };
      setMessages(previousMessages => GiftedChat.append(previousMessages, [newMessage]));
    } catch (error) {
      console.error("Error:", error);
    }
  };
  // ✅ Load initial messages
  // useEffect(() => {
  // }, []);

  // ✅ Fix the `onSend` type issue
  const onSend = useCallback((newMessages= []) => {
    //new message refers to the latest message sent by user
    if (newMessages.length === 0) return;

    console.log(messages)
    setMessages(messages => GiftedChat.append(messages, newMessages));
    console.log(messages)
    console.log(newMessages[0])
    
    // send message to backend
    sendMessage(newMessages[0]);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerText}>ChatGPT</Text> {/* Ensure `style={styles.bannerText}` is used */}
      </View>

      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)} // Ensure correct function signature
        user={{ 
          _id: user?.id || 2, 
          name: user?.name || 'User',
        }} // Current user, stands for "who is reading the chat"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  banner: {
    backgroundColor: '#2E86C1', // Blue header like most chat apps
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
