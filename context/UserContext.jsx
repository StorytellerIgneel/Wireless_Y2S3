import { createContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const UserContext = createContext(null);

// Setup API URL depending on the platform
let API_URL;
if (Platform.OS === 'ios') {
  API_URL = 'http://localhost:5000'; // iOS Simulator
} else if (Platform.OS === 'android') {
  API_URL = 'http://10.0.2.2:5000'; // Android Emulator
} else {
  const localIp = Constants.manifest?.debuggerHost?.split(':').shift();
  API_URL = `http://${localIp}:5000`;
}

export const UserProvider = ({ children }, ...props) => {
    const [user, setUser] = useState(null);

    const saveUser = async (userInfo) => {
        try {
            await AsyncStorage.multiSet([
                ['username', userInfo.username],
                ['email', userInfo.email],
                ['phone', userInfo.phone],
                ['password', userInfo.password]
            ]);

            return true;
        } catch (err) {

            return false;
        }
    }

    const clearUser = async () => {
        try {
            await AsyncStorage.multiRemove('username', 'email', 'phone', 'password');

            return true;
        } catch (err) {
            
            return false;
        }
    }

    // Load saved user details
    const loadUser = async () => {
        try {
            const keys = await AsyncStorage.multiGet(['username', 'email', 'phone', 'password']);

            if (keys.find(pair => pair[1] == null))
                return false;

            const username = keys[0][1];
            const email = keys[1][1];
            const phone = keys[2][1];
            const password = keys[3][1];

            const response = await axios.post(`${API_URL}/auth/login`, {
                username,
                password,
            });

            // Make sure client not trying to bypass
            if (response.data.email !== email)
                return false;

            if (response.data.phone !== phone)
                return false;

            loginUser({
                username,
                email,
                phone
            });

            return true;

        } catch (err) {

            return false;
        }
    }

    const loginUser = (userInfo) => {
        setUser(userInfo)
    };

    const logoutUser = () => {
        setUser(null);
        clearUser(); // Clears remember me
    };

    useEffect(() => {
        loadUser(); // Fetch from Async Storage to check to any Remember Me
    }, []);
    
    return (
        <UserContext.Provider value={{user, loginUser, logoutUser, saveUser, clearUser}} {...props}>
            { children }
        </UserContext.Provider>
    );
}

export default UserContext;