import sqlite3
from db_operations import db
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS

feedback_bp = Blueprint("feedback", __name__)

@feedback_bp.route("/feedback", methods = ["POST"])
def feedback():
    data = request.get_json()  # Get JSON data from request
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400
    
    user_id = int(data.get("user_id"))
    feedback_type = data.get("type")
    feedback_desc = data.get("description")

    if not all([user_id, feedback_type, feedback_desc]):
        print("missing fields")
        return jsonify({"response": "Error: Missing fields"}), 400
    #check if user id is present
    sql_select = "SELECT email FROM users WHERE id = ?"
    try:
        user = db.fetch_one(sql_select, (user_id, ))  
        user_email = user[0] if user else None  # Extract email if exists
        if not user:
            return jsonify({"response": "Error: User not found"}), 404
    except sqlite3.IntegrityError:
        print("db constraint violation")
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        print("db error")
        return jsonify({"response": f"Error: {e}"}), 400
    
    sql_insert = "INSERT INTO feedbacks (user_id, feedback_type, feedback_description) VALUES (?, ?, ?)"

    try:
        db.execute_query(sql_insert, (user_id, feedback_type, feedback_desc))
        return jsonify({"response": "Feedback submitted successfully", "user_email": user_email}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400