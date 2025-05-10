// socket.js
import { io } from 'socket.io-client';

const socket = io('http://10.0.2.2:5000', {
    autoConnect:false,
    transports:["websocket"]
}); // use your backend IP
export default socket;
