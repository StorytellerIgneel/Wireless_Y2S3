import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList } from "react-native";
import io from "socket.io-client";

// Connect to your Flask backend
const socket = io("http://192.168.43.114:5000", {
  transports: ["websocket"],
});

const SocketTest = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // When a message is received
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data.msg]);
    });

    return () => {
      socket.off("message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== "") {
      socket.emit("message", message);
      setMessage(""); // Clear input field
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        style={{backgroundColor: "white"}}
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text style={{color:"black"}}>{item}</Text>}
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type a message..."
        style={{backgroundColor:"blue" ,borderBottomWidth: 1, padding: 10, color: "white" }}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

export default SocketTest;