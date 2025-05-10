from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from restful_apis.auth import auth_bp
from restful_apis.feedback import feedback_bp
from restful_apis.shelves import shelves_bp
from websocket_apis.chatbot import init_chatbot_socketio
from websocket_apis.community import init_community_socketio

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

#initialize sockets
init_chatbot_socketio(socketio)
init_community_socketio(socketio)

#register blueprint for RESTfuls
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(feedback_bp, url_prefix="/feedback")
app.register_blueprint(shelves_bp, url_prefix="/api/shelves")

if __name__ == "__main__":
    import eventlet
    import eventlet.wsgi
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)