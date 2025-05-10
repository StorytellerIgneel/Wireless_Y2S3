import sqlite3
import os
from db_operations import db;
import requests
from flask import Flask, request, jsonify, Blueprint

shelves_bp = Blueprint("shelves", __name__)

@shelves_bp.route("/get_shelves", methods=["POST"])
def get_shelves():
    user_id = request.get_json().get("user_id")

    if not user_id:
        return jsonify({"response": "Error: Invalid request body"}), 400

    sql = "SELECT * FROM shelves WHERE user_id = ?"

    try:
        bookshelves = db.fetch_all(sql, (user_id, ))
        return jsonify({"bookshelves": bookshelves, "response": "Bookshelves retrieved succesfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

# create route
@shelves_bp.route("/create", methods=["POST"])
def create_new_shelf():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400

    user_id = data.get("user_id")
    shelf_name = data.get("shelf_name")

    if not all([user_id, shelf_name]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql = "INSERT into shelves (user_id, shelf_name) VALUES (?, ?)"

    try:
        db.execute_query(sql, (user_id, shelf_name))
        return jsonify({"response": "Book shelf created successfully", "status": "success"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

@shelves_bp.route("/update", methods=["POST"])
def update_shelf_name():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400
    
    shelf_id = data.get("shelf_id")
    user_id = data.get("user_id")
    new_shelf_name = data.get("shelf_name")

    if not all([shelf_id, new_shelf_name, user_id]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_check = "SELECT * FROM shelves WHERE id = ? and user_id = ?"

    try:
        result = db.fetch_one(sql_check, (shelf_id, user_id))
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    
    if result is None:
        return jsonify({"response": "Error: Shelf does not exist"}), 404

    sql = "UPDATE shelves SET shelf_name = ? WHERE id = ?"

    try:
        db.execute_query(sql, (new_shelf_name, shelf_id))
        return jsonify({"response": "Shelf name updated successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

@shelves_bp.route("/delete", methods=["POST"])    
def delete_shelf():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400
    
    shelf_id = data.get("shelf_id")
    user_id = data.get("user_id")

    if not all([shelf_id, user_id]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_check = "SELECT * FROM shelves WHERE id = ? and user_id = ?"

    try:
        result = db.fetch_one(sql_check, (shelf_id, user_id))
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    
    if result is None:
        return jsonify({"response": "Error: Shelf does not exist"}), 404
    
    sql = "DELETE from shelves WHERE id = ? and user_id = ?"

    try:
        db.execute_query(sql, (shelf_id, user_id))
        return jsonify({"response": "Shelf deleted successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

@shelves_bp.route("/get_books", methods=["POST"])
def get_shelf_books():
    shelf_id = request.get_json().get("shelf_id")

    if not shelf_id:
        return jsonify({"response": "Error: Invalid request body"}), 400

    sql = "SELECT * FROM shelf_books WHERE shelf_id = ?"

    try:
        books = db.fetch_all(sql, (shelf_id, ))
        return jsonify({"books": books, "response": "Bookshelves retrieved succesfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400
    
@shelves_bp.route("/add_books", methods=["POST"])    
def add_book_to_shelf():
    data = request.get_json()

    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400
    
    shelf_id = data.get("shelf_id")
    book_id = data.get("book_id")

    if not all([shelf_id, book_id]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_insert = "INSERT INTO shelf_books (shelf_id, book_id) VALUES (?, ?)"
    try:
        db.execute_query(sql_insert, (shelf_id, book_id))
        return jsonify({"response": "Book added to shelf successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

@shelves_bp.route("/delete_books", methods=["POST"])    
def delete_book_from_shelf():
    data = request.get_json()

    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400
    
    shelf_id = data.get("shelf_id")
    book_id = data.get("book_id")

    if not all([shelf_id, book_id]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_insert = "DELETE from shelf_books where shelf_id = ? and book_id = ?"
    try:
        db.execute_query(sql_insert, (shelf_id, book_id))
        return jsonify({"response": "Book removed from shelf successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400