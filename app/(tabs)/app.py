from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)  # Allow requests from React Native

# Set up Gemini API
genai.configure(api_key="AIzaSyASukWnV1JCx4_M3l_W3c55Nq_z95h0za8")

# Chat endpoint
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("userInput", "")
    print(f"user input: {user_input}")

    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    try:  
        model = genai.GenerativeModel("gemini-pro")  
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
    app.run(debug=True)
