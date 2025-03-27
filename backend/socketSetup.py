from flask import Flask, request
from flask_socketio import SocketIO, emit, join_room, leave_room

app = Flask(__name__)
#app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")  # Allow all origins for testing

# Store active rooms (optional)
rooms = {}

@app.route('/')
def home():
    return "Socket.IO Chat Backend Running"

# Handle client connection
@socketio.on('connect')
def handle_connect():
    print(f"Client {request.sid} connected")
    emit('message', {'msg': 'Connected to server'})

# Handle joining a room
@socketio.on('join_room')
def handle_join(data):
    room = data['room']
    username = data['username']
    
    join_room(room)
    rooms.setdefault(room, []).append(username)

    emit('message', {'msg': f"{username} joined {room}"}, room=room)
    print(f"{username} joined room: {room}")

# Handle leaving a room
@socketio.on('leave_room')
def handle_leave(data):
    room = data['room']
    username = data['username']
    
    leave_room(room)
    if room in rooms:
        rooms[room].remove(username)

    emit('message', {'msg': f"{username} left {room}"}, room=room)
    print(f"{username} left room: {room}")

# Handle chat messages
@socketio.on('message')
def handle_message(data):
    print(data)
    #room = data['room']
    #msg = data['msg']
    msg = data
    #username = data['username']

    emit('message', {'msg': msg}, broadcast=True)
    print(f"Message: {msg}")

# Handle client disconnect
@socketio.on('disconnect')
def handle_disconnect():
    print(f"Client {request.sid} disconnected")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
