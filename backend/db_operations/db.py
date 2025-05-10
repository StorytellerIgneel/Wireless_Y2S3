import sqlite3
from contextlib import closing

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