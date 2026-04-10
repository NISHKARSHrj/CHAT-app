from flask import Flask, request, jsonify, render_template
from database import get_connection 
from datetime import datetime
def register_routes(app):
    @app.route('/')
    def chat_ui():
        return render_template('chat.html')
    
    @app.route("/users", methods=["POST"])
    def create_user():
        data = request.get_json()
        name = data.get("name")
        if not name:
            return jsonify({"error": "Name is required"}), 400
        conn = get_connection()
        # ... (rest of the implementation)  
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO users (name) VALUES(?)

        """, (name,))    
        conn.commit()
        user_id = cursor.lastrowid
        conn.close()
        return {"id": user_id,
                "name": name}
    @app.route("/users", methods=["GET"])
    def get_users():
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM users")
        rows = cursor.fetchall()
        conn.close()
        return jsonify([{"id": r[0], "name": r[1]} for r in rows])
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
            SELECT messages.text, messages.timestamp, users.name, messages.user_id, messages.id
            FROM messages
            JOIN users ON messages.user_id = users.id
            ORDER BY messages.id DESC
        """)
        rows = cursor.fetchall()
        conn.close()
        return jsonify([
            {
                "id": r[4],
                "user": r[2],
                "text": r[0],
                "timestamp": r[1],
                "user_id": r[3]
            }
            for r in rows
        ])
    @app.route("/deletemsg", methods=["DELETE"])
    def dlt_msg():
        data = request.get_json()

        msg_id = data.get("msg_id")

        if not msg_id:
            return jsonify({
                "error": "Message ID is required"
            }), 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("DELETE FROM messages WHERE id = ?", (msg_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            return jsonify({
                "error": "Message not found"
            }), 404

        conn.commit()
        conn.close()

        return jsonify({
            "message": "Message deleted successfully"
        })