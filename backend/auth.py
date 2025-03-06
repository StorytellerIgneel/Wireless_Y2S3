import mysql.connector
from flask import Flask, request, jsonify, Blueprint
from flask_cors import CORS

auth_bp = Blueprint("auth", __name__)

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="teoH0628$$$$",
        database="WAD_Y2S3"
    )

#for login route
@auth_bp.route("/login", methods = ["POST"])
def login():
    data = request.get_json()  # Get JSON data from request
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400
    
    username = data.get("username")
    password = data.get("password")
    if not all([username, password]):
        return jsonify({"response": "Error: Missing fields"}), 400
    
    #search for username and pw in db
    sql = "SELECT password FROM users WHERE username = %s"
    with get_db_connection() as conn: #auto close
        with conn.cursor() as cursor:
            cursor.execute(sql, (username,))
            result = cursor.fetchone()

    if (result is None):
        print("user doesnt exsit")
        return jsonify({"response": "Error: User does not exist"}), 404
    elif (password == result[0]):
        print("login successful")
        return jsonify({"response": "Login successful"}), 200
    else:
        print("incorrect password")
        return jsonify({"response": "Error: Incorrect password"}), 401

#register route
@auth_bp.route("/register", methods = ["POST"])
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
    
    sql_check = "SELECT password FROM users WHERE username = %s" #check if username already exists
    sql_insert = "INSERT INTO users (username, email, password, phone_number) VALUES (%s, %s, %s, %s)"

    with get_db_connection() as conn:
        with conn.cursor() as cursor:
            cursor.execute(sql_check, (username,))
            result = cursor.fetchone()

            if result: #username already exists
                return jsonify({"response": "Error: Username already exists"}), 409

            try:
                value = (username, email, password, phone_number)
                cursor.execute(sql_insert, value)
                conn.commit() #commit changes to db
                return jsonify({"response": "Registration successful"}), 201
            except mysql.connector.IntegrityError:
                return jsonify({"response": "Error: Database constraint violation"}), 400
            except mysql.connector.Error as e:
                return jsonify({"response": f"Error: {e}"}), 400

# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)
