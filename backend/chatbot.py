from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
import google.generativeai as genai

chatbot_bp = Blueprint("chatbot", __name__)

app = Flask(__name__)
CORS(app)  # Allow requests from React Native

# Set up Gemini API
genai.configure(api_key="AIzaSyAMXmbCIKxIWeV_OlqwFnLIXsyE1EeL9Ho")

# Chat endpoint
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("userInput", "")
    print(f"user input: {user_input}")

    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    try:  
        model = genai.GenerativeModel("gemini-1.5-pro-001")
        response = model.generate_content(user_input) 
        print(response.text)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error generating response: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/initialize", methods=["GET"])
def initialize():
    return jsonify({"response": "Welcome!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
    #app.run()