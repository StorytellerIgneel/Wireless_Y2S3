// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';

const socket = io('http://10.0.2.2:5000'); // ⚠️ Replace with your backend IP

export default function Rooms({user_id, username, book_id}) {
  const [room_id, setRoom_id] = useState(book_id);
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    joinRoom();
    socket.on('chat_history', (data) => {
      setMessages(data.history);
    });

    socket.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const joinRoom = () => {
    const parsedUserID = parseInt(user_id);
    if (room_id && username && !isNaN(parsedUserID)) {
      socket.emit('join_room', { room_id, username, user_id: parsedUserID });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    const parsedUserID = parseInt(user_id);
    if (message.trim() && !isNaN(parsedUserID)) {
      socket.emit('send_message', { msg: message, username, user_id: parsedUserID });
      setMessage('');
    }
  };

  const reset = () => {
    socket.emit("leave_room", { username });
    setJoined(false);
    setMessages([]);
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <>
        <Text style={{ marginBottom: 10 }}>Joined Community for: {room}</Text>
        <ScrollView style={styles.chat}>
          {messages.map((m, i) => (
            <Text key={i}><Text style={{ fontWeight: 'bold' }}>{m.username}: </Text>{m.msg}</Text>
          ))}
        </ScrollView>
        <TextInput
          placeholder="Type message..."
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />
        <Button title="Send" onPress={sendMessage} />
        <Button title="Leave Room" onPress={reset} color="gray" />
      </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "white", flex: 1, padding: 20, paddingTop: 50 },
  input: { color: "black", borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10 },
  chat: { color: "black", flex: 1, borderWidth: 1, padding: 10, marginBottom: 10 },
  roomButtons: { flexDirection: 'row', marginBottom: 10, gap: 10 },
  roomBtn: { borderWidth: 1, padding: 10, borderRadius: 5 },
  selected: { backgroundColor: '#cde' }
});
