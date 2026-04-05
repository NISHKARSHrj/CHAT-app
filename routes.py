from flask import Flask, app, request, jsonify
from database import get_connection 
from datetime import datetime
def register_routes(app):
    @app.route('/')
    def index():
        return 'Hello, World!'
    
    @app.route("/users", methods=["POST"])
    def create_user():
        data = request.get_json()
        name = data.get("name")

        conn = get_connection()
        # ... (rest of the implementation)  
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO users (name) VALUES(?)

        """, (name,))    
        conn.commit()
        
        conn.close()
        return {"name": name}
    
    @app.route("/send", methods=["POST"])
    def send_message():
        data = request.get_json()
        
        user_id = data.get("user_id")
        text = data.get("text")

        timestamp = datetime.now().isoformat()

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
                INSERT INTO messages (user_id, text, timestamp)
                VALUES(?,?,?)
                
        """, (user_id, text, timestamp))

        conn.commit()
        return jsonify({
            "text": "message sent successfully"
        })
    
    @app.route("/messages", methods=["GET"])
    def messages():
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT messages.text, messages.timestamp, messages.user_id
            FROM messages
            JOIN users ON messages.user_id = users.id
            ORDER BY messages.id DESC
        
        
        """)
        rows = cursor.fetchall()

        return jsonify([
        {
            "user": r[2],
            "text": r[0],
            "timestamp": r[1]
        }
        for r in rows
    ])