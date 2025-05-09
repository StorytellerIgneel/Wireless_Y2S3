from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime
import os
from db_operations import db

app = Flask(__name__)
CORS (app)
#app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for testing

# Store active rooms (optional)
rooms = {}
user_rooms = {}

def init_community_socketio(io: SocketIO):
    global socketio
    socketio = io

    # Handle client connection
    @socketio.on('connect')
    def handle_connect():
        print(f"Client {request.sid} connected") #request sid is auto assigned by socketio
        emit('message', {'msg': 'Connected to server'})

    # Handle joining a room
    @socketio.on('join_room')
    def handle_join(data):
        print(f"Client {request.sid} joined room: {data['room']}")
        #extracting data from arg
        room = data['room']
        username = data['username']
        
        join_room(room) #join the room eg room-1234
        #if the room is not already a key in the rooms dict, create it, and assign empty list for value
        rooms.setdefault(room, []).append(username) #add user to the room list
        user_rooms[request.sid] = room #store the room in the user_rooms dict
        print(user_rooms)
        chat_history = get_chat_history(room)

        emit('chat_history', {'history': chat_history}, to=request.sid) 
        #send the chat_history to only the reqe
        print(f"{username} joined room: {room}")

    def get_chat_history(room):
        query = 'SELECT username, msg FROM messages WHERE room = ? ORDER BY timestamp ASC LIMIT 50'
        result = db.fetch_all(query, (room,))
        print(result)
        return [{"username": row[0], "msg": row[1]} for row in result]

    # Handle leaving a room
    @socketio.on('leave_room')
    def handle_leave(data):
        room = user_rooms[request.sid]
        username = data['username']
        
        leave_room(room)
        if room in rooms:
            rooms[room].remove(username)
        if request.sid in user_rooms:
            del user_rooms[request.sid] #remove the room from the user_rooms dict

        emit('message', {'msg': f"{username} left {room}"}, room=room)
        print(f"{username} left room: {room}")

    # Handle chat messages
    @socketio.on('broadcast_message')
    def broadcast_message(data):
        print(data)
        print(f"request.sid = {request.sid}")
        #room = data['room']
        #msg = data['msg']
        msg = data
        #username = data['username']

        emit('message', {'msg': data["msg"] + f"by {request.sid}"}, broadcast=True, skip_sid="mOfKhP86gKFnBbPsAAAB")
        print(f"Message: {msg}")

    #used when the user have already joined a room, and sends message into it
    @socketio.on('send_message')
    def handle_message(data):
        msg = data['msg']
        username = data['username']
        room = user_rooms[request.sid]
        print(user_rooms)
        print(room)
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        emit('message', 
            {'username': username, 
            'msg': msg
            },
            room=room)

        db.execute_query('INSERT INTO messages (room, username, msg, timestamp) VALUES (?, ?, ?, ?)', (room, username, msg, timestamp))
        print(f"Message: {msg}")

    # Handle client disconnect
    @socketio.on('disconnect')
    def handle_disconnect():
        print(f"Client {request.sid} disconnected")
