import sqlite3

with open("db.sql", "r") as f:
    sql_script = f.read()

conn = sqlite3.connect("database.sqlite3")
cursor = conn.cursor()

cursor.executescript(sql_script)

conn.commit()
conn.close()