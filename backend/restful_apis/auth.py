import sqlite3
import os
from db_operations import db;
import requests
import random
import threading
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

    sql = "SELECT password, user_id, email, phone_number FROM users WHERE username = ?"
    result = db.fetch_one(sql, (username,))

    if result is None:
        return jsonify({"response": "Error: User does not exist"}), 404
    elif check_password_hash(result[0], password):  # Secure password check
        return jsonify({"response": "Login successful", "id": str(result[1]), "email": result[2], "phone": result[3]}), 200
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

    sql_check = "SELECT password, username, email, phone_number FROM users WHERE username = ? OR email = ? OR phone_number = ?"
    sql_insert = "INSERT INTO users (username, email, password, phone_number) VALUES (?, ?, ?, ?)"

    result = db.fetch_one(sql_check, (username, email, phone_number))
    if result:
        if result[1] == username:
            return jsonify({"response": "Error: Username already registered"}), 409
        elif result[2] == email:
            return jsonify({"response": "Error: E-mail already registered"}), 409
        else:
            return jsonify({"response": "Error: Phone number already registered"}), 409

    try:
        hashed_password = generate_password_hash(password)  # Hash password
        values = (username, email, hashed_password, phone_number)
        id = db.get_last_row(sql_insert, values)
        return jsonify({"response": "Registration successful", "id": str(id)}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

# set up for recovery codes
recovery_codes = {}
recovery_timers = {}

def generate_recovery_code(email):
    # remove previous cache if contains
    if email in recovery_timers:
        recovery_timers[email].cancel()
        recovery_codes.pop(email, None)

    # generate new one
    while True:
        code = f"{random.randint(0, 999999):06d}"

        if code not in recovery_codes:
            break

    recovery_timers[email] = threading.Timer(3600, lambda: recovery_codes.pop(email, None))
    recovery_codes[email] = code

    recovery_timers[email].start()

    return code

# Code verification route
@auth_bp.route("/verify_code", methods=["POST"])
def verify_code():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400

    email = data.get("email")
    recoveryCode = data.get("code")

    if not all([email, recoveryCode]):
        return jsonify({"response": "Error: Missing fields"}), 400

    if email not in recovery_codes:
        return jsonify({"response": "Error: Invalid email"}), 401
    
    if recovery_codes[email] != recoveryCode:
        return jsonify({"response": "Error: Invalid recovery code"}), 401
    
    return jsonify({"response": "Valid code"}), 200

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
    
    recoveryCode = generate_recovery_code(email)

    try:
        res = requests.post("https://api.emailjs.com/api/v1.0/email/send", json={
            "service_id": "service_qpnbwi7",
            "template_id": "template_hcfgn4m",
            "user_id": "g-qKNdLDvirbQ1Zih",
            "template_params": {
                "email": email,
                "code": recoveryCode
            },
            "accessToken": "xhOQdmH-i1xtTWEObpwup"
        })

        res.raise_for_status()

        return jsonify({"response": "Success"}), 200
        
    except requests.exceptions.RequestException as e:
        if res is not None:
            print(res.status_code)
            print(res.text)

        return jsonify({"response": "Error: Could not send email"}), 400

# Password reset route
@auth_bp.route("/reset_password", methods=["POST"])
def reset_password():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400

    email = data.get("email")
    recoveryCode = data.get("code")
    newPassword = data.get("password")

    print(recovery_codes)

    if not all([email, recoveryCode, newPassword]):
        return jsonify({"response": "Error: Missing fields"}), 400

    if email not in recovery_codes:
        return jsonify({"response": "Error: Invalid email"}), 401
    
    if recovery_codes[email] != recoveryCode:
        return jsonify({"response": "Error: Invalid recovery code"}), 401

    sql_check = "SELECT password FROM users WHERE email = ?"
    result = db.fetch_one(sql_check, (email,))

    if result is None:
        return jsonify({"response": "Error: User does not exist"}), 404
    elif check_password_hash(result[0], newPassword):  # Secure password check
        return jsonify({"response": "Error: New password cannot be same as previous"}), 409
    
    # perform cleaning
    recovery_timers.clear()
    recovery_timers.pop(email, None)
    recovery_codes.pop(email, None)
    try:
        rows_updated = db.update_password(email, newPassword)
        if rows_updated > 0:
            return jsonify({"response": "New password updated"}), 200
        elif rows_updated == 0:
            return jsonify({"response": "Error: Email not found"}), 404
        else:
            return jsonify({"response": "Error: Email not found"}), 404
    except sqlite3.IntegrityError as e:
        print(e)
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        print(e)
        return jsonify({"response": f"Error: {e}"}), 400