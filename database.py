import sqlite3
import datetime

def get_connection():
    return sqlite3.connect("database.db")

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            text TEXT,
            timestamp TEXT
        )
    """)

    conn.commit()
    conn.close()