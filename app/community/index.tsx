// App.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { io } from 'socket.io-client';

const socket = io('http://10.0.2.2:5000'); // ⚠️ Replace with your backend IP

export default function Rooms() {
  const [room, setRoom] = useState(null);
  const [userID, setUserID] = useState('');
  const [username, setUsername] = useState('');
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
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
    const parsedUserID = parseInt(userID);
    if (room && username && !isNaN(parsedUserID)) {
      socket.emit('join_room', { room, username, user_id: parsedUserID });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    const parsedUserID = parseInt(userID);
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
      {!joined ? (
        <>
          <TextInput
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
          />
          <TextInput
            placeholder="Enter user ID (integer)"
            value={userID}
            onChangeText={setUserID}
            style={styles.input}
            keyboardType='numeric'
          />
          <Text style={{ marginVertical: 10 }}>Select a Room:</Text>
          <View style={styles.roomButtons}>
            <TouchableOpacity onPress={() => setRoom('room-1')} style={[styles.roomBtn, room === 'room-1' && styles.selected]}>
              <Text>Room 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setRoom('room-2')} style={[styles.roomBtn, room === 'room-2' && styles.selected]}>
              <Text>Room 2</Text>
            </TouchableOpacity>
          </View>
          <Button title="Join Room" onPress={joinRoom} disabled={!room || !username || !userID} />
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 10 }}>Joined: {room}</Text>
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
      )}
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
