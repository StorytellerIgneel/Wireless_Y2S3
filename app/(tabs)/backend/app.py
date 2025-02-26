from flask import Flask
from flask_cors import CORS
from auth import auth_bp
from chatbot import chatbot_bp
from feedback import feedback_bp

app = Flask(__name__)
CORS(app)

#register blueprint
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(chatbot_bp, url_prefix="/chatbot")
app.register_blueprint(feedback_bp, url_prefix="/feedback")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)