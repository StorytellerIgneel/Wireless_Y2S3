import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import {View, StyleSheet, Text } from 'react-native';
import axios from 'axios';

//const API_URL = 'http://10.0.2.2:5000/chat';
const API_URL = 'http://192.168.43.114:5000/chat';

const ChatScreen = () => {
  const [messages, setMessages] = useState<IMessage[]>([]);

  //connecting to backend chat api
  const sendMessage = async (userMessage: IMessage) => {
    if (!userMessage.text.trim()) return;
    try {
      const res = await axios.post(API_URL, {userInput: userMessage.text });

      console.log("res: " + res.data.response)
      const newMessage: IMessage = {
        _id: String(new Date().getTime()),  // Unique ID based on timestamp
        text: res.data.response,            // Message from API response
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
  const onSend = useCallback((newMessages: IMessage[] = []) => {
    //new message refers to the latest message sent by user
    if (newMessages.length == 0) return;

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
        user={{ _id: 2, name: 'Klein' }} // Current user, stands for "who is reading the chat"
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
