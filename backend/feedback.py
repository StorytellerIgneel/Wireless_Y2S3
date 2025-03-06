import mysql.connector
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS

feedback_bp = Blueprint("feedback", __name__)

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="teoH0628$$$$",
        database="WAD_Y2S3"
    )

@feedback_bp.route("/feedback", methods = ["POST"])
def feedback():
    data = request.get_json()  # Get JSON data from request
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400
    user_id = data.get("user_id")
    feedback_type = data.get("type")
    feedback_desc = data.get("description")
    if not all([user_id, feedback_type, feedback_desc]):
        return jsonify({"response": "Error: Missing fields"}), 400
    
    sql_insert = "INSERT INTO feedbacks (user_id, feedback_type, feedback_description) VALUES (%s, %s, %s)"
    try:
        with get_db_connection() as conn: #auto close
            with conn.cursor() as cursor:
                cursor.execute(sql_insert, (user_id, feedback_type, feedback_desc))
                conn.commit() #commit changes to db
                return jsonify({"response": "Registration successful"}), 201
    except mysql.connector.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except mysql.connector.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
