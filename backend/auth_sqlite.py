import sqlite3
import os
import db;
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash  # Secure passwords

auth_bp = Blueprint("auth", __name__)

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
    result = db.fetch_one(sql, (username,))

    if result is None:
        return jsonify({"response": "Error: User does not exist"}), 404
    elif check_password_hash(result[0], password):  # ✅ Secure password check
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

    # Check if the username already exists
    user_exists = db.fetch_one(sql_check, (username,))
    if user_exists:
        return jsonify({"response": "Error: Username already exists"}), 409
    else:
        try:
            hashed_password = generate_password_hash(password)  # ✅ Hash password
            values = (username, email, hashed_password, phone_number)
            db.execute_query(sql_insert, values)
            return jsonify({"response": "Registration successful"}), 201
        except sqlite3.IntegrityError:
            return jsonify({"response": "Error: Database constraint violation"}), 400
        except sqlite3.Error as e:
            return jsonify({"response": f"Error: {e}"}), 400
