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
    name = data.get("name")

    if not all([user_id, name]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql = "INSERT into shelves (user_id, name) VALUES (?, ?)"

    try:
        db.execute_query(sql, (user_id, name))
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
    
    id = data.get("id")
    user_id = data.get("user_id")
    name = data.get("name")

    if not all([id, name, user_id]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_check = "SELECT * FROM shelves WHERE id = ? and user_id = ?"

    try:
        result = db.fetch_one(sql_check, (id, user_id))
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    
    if result is None:
        return jsonify({"response": "Error: Shelf does not exist"}), 404

    sql = "UPDATE shelves SET name = ? WHERE id = ?"

    try:
        db.execute_query(sql, (name, id))
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
    
    id = data.get("id")
    user_id = data.get("user_id")

    if not all([id, user_id]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_check = "SELECT * FROM shelves WHERE id = ? and user_id = ?"

    try:
        result = db.fetch_one(sql_check, (id, user_id))
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    
    if result is None:
        return jsonify({"response": "Error: Shelf does not exist"}), 404
    
    sql = "DELETE from shelves WHERE id = ? and user_id = ?"

    try:
        db.execute_query(sql, (id, user_id))
        return jsonify({"response": "Shelf deleted successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

@shelves_bp.route("/get_books", methods=["POST"])
def get_shelf_books():
    shelf_id = request.get_json().get("shelf_id")
    user_id = request.get_json().get("user_id")  # Get user_id for progress lookup

    if not shelf_id:
        return jsonify({"response": "Error: Invalid request body"}), 400

    sql = "SELECT * FROM shelf_books WHERE shelf_id = ?" 

    try:
        books_on_shelf_raw = db.fetch_all(sql, (shelf_id, ))

        detailed_books = []
        for row in books_on_shelf_raw:
            book_id_from_db = row[2] 
            
            # Fetch reading progress for this book and user
            progress_sql = """
                SELECT progress FROM view_record 
                WHERE user_id = ? AND book_id = ?
                ORDER BY viewed_at DESC LIMIT 1
            """
            progress_record = db.fetch_one(progress_sql, (user_id, book_id_from_db))
            progress = progress_record[0] if progress_record else 0
            
            # Fetch from Gutendex
            gutendex_url = f"https://gutendex.com/books/{book_id_from_db}"
            try:
                response = requests.get(gutendex_url)
                response.raise_for_status() 
                book_details = response.json()
                
                # Add progress to book details
                book_details["progress"] = progress
                
                detailed_books.append(book_details)
            except requests.exceptions.RequestException as e:
                print(f"Error fetching book {book_id_from_db} from Gutendex: {e}")
                continue 
            except ValueError:
                print(f"Error decoding JSON for book {book_id_from_db} from Gutendex.")
                continue

        shelf_info_sql = "SELECT name FROM shelves WHERE id = ?"
        shelf_info = db.fetch_one(shelf_info_sql, (shelf_id,))
        shelf_name = shelf_info[0] if shelf_info else "Unknown Shelf"

        return jsonify({"books": detailed_books, "shelf_title": shelf_name, "response": "Books retrieved successfully"}), 200
    except sqlite3.Error as e:
        print(f"Database error in get_shelf_books: {e}")
        return jsonify({"response": f"Error: Database operation failed: {e}"}), 500
    except Exception as e: 
        print(f"Unexpected error in get_shelf_books: {e}")
        return jsonify({"response": f"Error: An unexpected error occurred: {e}"}), 500

@shelves_bp.route("/add_books", methods=["POST"])    
def add_book_to_shelf():
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request must be JSON"}), 400

    shelf_id = data.get("shelf_id")
    book_id = data.get("book_id")
    user_id = data.get("user_id") 

    print(f"Received add_books request: shelf_id={shelf_id}, book_id={book_id}, user_id={user_id}") # Backend log

    if not all([shelf_id, book_id, user_id]): 
        return jsonify({"message": "Missing shelf_id, book_id, or user_id"}), 400

    sql_insert = "INSERT INTO shelf_books (user_id, shelf_id, book_id) VALUES (?, ?, ?)"
    try:
        db.execute_query(sql_insert, (user_id, shelf_id, book_id))
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
    
@shelves_bp.route("/log_book", methods=["POST"])
def log_book():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400
    
    book_id = data.get("book_id")
    user_id = data.get("user_id")
    progress = data.get("progress", 0)

    if not all([book_id, user_id]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_insert = """
        INSERT INTO view_record (user_id, book_id, progress)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, book_id)
        DO UPDATE SET progress = excluded.progress, viewed_at = datetime('now')
    """

    try:
        db.execute_query(sql_insert, (user_id, book_id, progress))
        return jsonify({"response": "Record added successfully"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"response": "Error: Database constraint violation"}), 400
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 400

@shelves_bp.route("/get_book_latest_record", methods=["POST"])
def get_latest_record():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400

    book_id = data.get("book_id")
    user_id = data.get("user_id")

    if not all([book_id, user_id]):
        return jsonify({"response": "Error: Missing fields"}), 400

    sql_query = """
        SELECT progress, viewed_at
        FROM view_record
        WHERE user_id = ? AND book_id = ?
        ORDER BY viewed_at DESC
        LIMIT 1
    """

    try:
        record = db.fetch_one(sql_query, (user_id, book_id))
        if record:
            progress, viewed_at = record
            return jsonify({
                "response": "Latest record retrieved successfully",
                "user_id": user_id,
                "progress": progress,
                "book_id": book_id,
                "viewed_at": viewed_at
            }), 200
        else:
            return jsonify({"response": "No reading record found for this book"}), 404
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 500

@shelves_bp.route("/get_latest_reading_record", methods=["POST"])
def get_latest_reading_record():
    data = request.get_json()
    if not data:
        return jsonify({"response": "Error: Invalid request body"}), 400

    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"response": "Error: Missing user_id"}), 400

    sql_query = """
        SELECT book_id, progress, viewed_at
        FROM view_record
        WHERE user_id = ?
        ORDER BY viewed_at DESC
        LIMIT 1
    """

    try:
        record = db.fetch_one(sql_query, (user_id,))
        if record:
            book_id, progress, viewed_at = record

            # Fetch book details from Gutendex
            gutendex_url = f"https://gutendex.com/books/{book_id}"
            try:
                response = requests.get(gutendex_url)
                response.raise_for_status()
                book_details = response.json()
                book_title = book_details.get("title", "Unknown Title")
                authors = book_details.get("authors", [])
                author_name = authors[0]["name"] if authors else "Unknown Author"

                # Extract book cover image
                formats = book_details.get("formats", {})
                cover_image = formats.get("image/jpeg")

            except requests.exceptions.RequestException as e:
                print(f"Error fetching book details from Gutendex: {e}")
                book_title = "Unknown Title"
                author_name = "Unknown Author"

            return jsonify({
                "response": "Latest reading record retrieved successfully",
                "book_id": book_id,
                "book_title": book_title,
                "author_name": author_name,
                "cover_image": cover_image,
                "progress": progress,
                "viewed_at": viewed_at
            }), 200
        else:
            return jsonify({"response": "No reading records found", "data": {}}), 200
    except sqlite3.Error as e:
        return jsonify({"response": f"Error: {e}"}), 500