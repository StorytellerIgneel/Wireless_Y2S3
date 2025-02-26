import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';

//const API_URL = "http://192.168.1.8:5000"; // Change if using a device (use local IP)
const API_URL = "http://192.168.1.8:5000"; //using expogo
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Login function
  const handleLogin = async () => {
    try {
        console.log("login")
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      console.log(response);
      Alert.alert("Success", response.data.response);
    } catch (error) {
        console.log(error);
      Alert.alert("Error", error.response?.data?.response);
    }
  };

  // Register function
  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { 
        username, 
        password, 
        email, 
        phone_number: phone 
      });
      Alert.alert("Success", response.data.response);
    } catch (error) {
      Alert.alert("Error", error.response?.data?.response || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native DB Test</Text>

      <TextInput style={styles.input} placeholder="Username" onChangeText={setUsername} value={username} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
      <TextInput style={styles.input} placeholder="Email (for register)" onChangeText={setEmail} value={email} />
      <TextInput style={styles.input} placeholder="Phone (for register)" onChangeText={setPhone} value={phone} />

      <Button title="Login" onPress={handleLogin} />
      <View style={{ height: 10 }} />
      <Button title="Register" color="green" onPress={handleRegister} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, color: "white" },
  input: { width: "80%", padding: 10, borderWidth: 1, marginBottom: 10, borderRadius: 5, color: "white"},
  buttonContainer: {
    width: "80%",
    marginTop: 10, 
    backgroundColor: "blue",
    borderRadius: 5,
    padding: 10,
    justifyContent: "center",
    alignItems: "center"
  }
});
