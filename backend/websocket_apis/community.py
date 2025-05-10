from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
from datetime import datetime
import os
from db_operations import db
import re

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
        print(f"Client {request.sid} joined room: {data['room_id']}")
        #extracting data from arg
        room = data['room_id']
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
        print("argument passed: ", room[5:])
        # Use room_id for querying the database
        query = """
        SELECT users.username, messages.msg
        FROM messages
        JOIN users ON messages.user_id = users.user_id
        WHERE messages.room_id = ?
        ORDER BY timestamp ASC
        LIMIT 50
        """

        # Fetch the chat history for the extracted room_id
        result = db.fetch_all(query, (room[5:],))  # Use room_id as the parameter
        print("chat history: ", result)  # Optional, to see the result in the console

        # Return a formatted response
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
        user_id = data["user_id"]
        print(user_rooms)
        room = user_rooms[request.sid]
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        emit('message', 
            {'username': username, 
            'msg': msg
            },
            room=room)
        
        match = re.search(r"room-(\d+)", room)

        if match:
            room_id = match.group(1)
            print(room_id) 

        db.execute_query('INSERT INTO messages (room_id, user_id, msg, timestamp) VALUES (?, ?, ?, ?)', (room_id, user_id, msg, timestamp))
        print(f"Message: {msg}")

    # Handle client disconnect
    @socketio.on('disconnect')
    def handle_disconnect():
        print(f"Client {request.sid} disconnected")
