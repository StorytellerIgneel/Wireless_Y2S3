import sqlite3
from contextlib import closing
from werkzeug.security import generate_password_hash, check_password_hash  # Secure passwords

import os

# Database connection function
DATABASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "database.sqlite3")
 #the db shud locate at the same dir as this file


def get_db_connection():
    print("DATABASE: " ,DATABASE)
    return sqlite3.connect(DATABASE, check_same_thread=False)

def execute_query(query, params=()):
    with closing(get_db_connection()) as conn:
        cur = conn.cursor()
        cur.execute(query, params)
        conn.commit()
        return cur

def fetch_one(query, params=()):
    with closing(get_db_connection()) as conn:
        cur = conn.cursor()
        cur.execute(query, params)
        return cur.fetchone()
    
def fetch_all(query, params=()):
    with closing(get_db_connection()) as conn:
        cur = conn.cursor()
        cur.execute(query, params)
        return cur.fetchall()

def get_last_row(query, params=()):
    with closing(get_db_connection()) as conn:
        cur = conn.cursor()
        cur.execute(query, params)
        conn.commit()
        return cur.lastrowid

def update_password(email, new_password):
    hashed_password = generate_password_hash(new_password)
    sql_update = "UPDATE users SET password = ? WHERE email = ?"
    #sql_update = "UPDATE users SET password = ? WHERE email = ?"

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql_update, (hashed_password, email))
            conn.commit()
            return cursor.rowcount  # Number of rows affected
    except Exception as e:
        print(f"Database error: {e}")
        return -1  # Indicates error
