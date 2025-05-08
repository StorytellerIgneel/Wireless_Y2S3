import sqlite3
import os
<<<<<<< Updated upstream
=======
import db;
import requests
>>>>>>> Stashed changes
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash  # Secure passwords

auth_bp = Blueprint("auth", __name__)

# Database connection function
DATABASE = os.path.join(os.getcwd(), "database.sqlite3")

def get_db_connection():
    return sqlite3.connect(DATABASE, check_same_thread=False)

# Login route
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400

    username = data.get("username")
    password = data.get("password")

    if not all([username, password]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql = "SELECT password FROM users WHERE username = ?"
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(sql, (username,)) #prevent sql injection
        result = cursor.fetchone()

    if result is None:
        return jsonify({"response": "Error: User does not exist"}), 404
    elif check_password_hash(result[0], password):  # Secure password check
        return jsonify({"response": "Login successful"}), 200
    else:
        return jsonify({"response": "Error: Incorrect password"}), 401

# Register route
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    phone_number = data.get("phone_number")

    if not all([username, email, password, phone_number]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_check = "SELECT password FROM users WHERE username = ?"
    sql_insert = "INSERT INTO users (username, email, password, phone_number) VALUES (?, ?, ?, ?)"

    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(sql_check, (username,))
        result = cursor.fetchone()

        if result:
            return jsonify({"response": "Error: Username already exists"}), 409

        try:
            hashed_password = generate_password_hash(password)  # Hash password
            values = (username, email, hashed_password, phone_number)
            cursor.execute(sql_insert, values)
            conn.commit()
            return jsonify({"response": "Registration successful"}), 201
        except sqlite3.IntegrityError:
            return jsonify({"response": "Error: Database constraint violation"}), 400
        except sqlite3.Error as e:
            return jsonify({"response": f"Error: {e}"}), 400

# Password recovery route
@auth_bp.route("/recover_password", methods=["POST"])
def recover_password():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400

    email = data.get("email")

    if not all([email]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql = "SELECT email FROM users WHERE email = ?"
    result = db.fetch_one(sql, (email,))

    if result is None:
        return jsonify({"response": "Error: User does not exist"}), 404
    
    try:
        res = requests.post("https://api.emailjs.com/api/v1.0/email/send", json={
            "service_id": "service_qpnbwi7",
            "template_id": "template_hcfgn4m",
            "user_id": "g-qKNdLDvirbQ1Zih",
            "template_params": {
                "email": email,
                "link": "myapp://auth/reset-password?code=10"
            },
            "accessToken": "xhOQdmH-i1xtTWEObpwup"
        })

        res.raise_for_status()

        return jsonify({"response": "Success"}), 200
        
    except requests.exceptions.RequestException as e:
        print(e)

        if res is not None:
            print(res.status_code)
            print(res.text)

        return jsonify({"response": "Error: Could not send email"}), 400
