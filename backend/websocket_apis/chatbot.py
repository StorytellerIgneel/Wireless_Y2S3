from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import google.generativeai as genai

chatbot_bp = Blueprint("chatbot", __name__)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure Gemini
genai.configure(api_key="AIzaSyAMXmbCIKxIWeV_OlqwFnLIXsyE1EeL9Ho")
model = genai.GenerativeModel("gemini-2.0-flash-lite")

#  active chats
# format: request_sid: chat(object from the start_chat func)
active_chats = {}

def init_chatbot_socketio(io: SocketIO):
    global socketio
    socketio = io

    @socketio.on("query")
    def handle_query(data):
        user_input = data.get("userInput", "")
        sid = request.sid  # Unique socket ID for each client

        if not user_input:
            emit("response", {"response": "⚠️ Message is required"})
            return

        try:
            # Reuse existing chat if it exists

            #this is for the situation where for first time interaction
            if sid not in active_chats:
                active_chats[sid] = model.start_chat(history=[]) #starts a fresh new session obj with no past records

            #this line retrieves the chat session started previously from the dict
            #the sid key is used for each connection to be unique
            chat = active_chats[sid]

            #sends the user latest input to gemini via chat object
            #get response with the existing history and context
            response = chat.send_message(user_input)
            #the chat obj contains 2 stuff, 1 is the send message func, another is the history attr
        
            #if u need to access the chat history, uncomment the below line
            #print("chatHistory: ", chat.history)
            #there is a socketio func in client to display the response
            emit("response", {"response": response.text})
        except Exception as e:
            print(f"Error generating response: {e}")
            emit("response", {"response": f"💥 Error: {str(e)}"})

    @socketio.on("disconnect")
    def clear_chat():
        sid = request.sid
        active_chats.pop(sid, None)  # Clean up memory when client disconnects
