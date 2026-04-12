FLASK LITE-CHAT APP

A clean, responsive, real-time chat application built with a Python (Flask) backend and a vanilla JavaScript frontend.


FEATURES---

1. User Management: Create new users or select existing ones from a persistent SQLite database.

2. Real-Time Feel: Automatic message polling every 2 seconds ensures the chat stays up to date.

3. Message Persistence: All chats are stored with timestamps and associated with specific users.

4. Self-Management: Users can delete their own individual messages or wipe their entire profile and message history.

5. Responsive UI: A modern, mobile-friendly interface inspired by popular messaging apps, featuring distinct "bubbles" for self and others


TECH STACK---

BACKEND: Python 3, Flask

DATABASE: SQLITE3 (SERVELESS)

FRONTEND: HTML5, CSS3, Vanilla javascript

ROUTING: FLASK-CORS for for cross-origin resourse sharing


Project Structure---

app.py: The entry point that initializes the Flask server and database.

database.py: Handles SQLite connection and table initialization (users and messages).

routes.py: Contains API endpoints for creating users, sending/retrieving messages, and deletion logic.

script.js: Frontend logic for fetching data, DOM manipulation, and interval polling.

style.css: Modern styling including animations for notifications and chat bubble layouts.


Installation & setup---

1. Clone the repository:

git clone https://github.com/NISHKARSHrj/FLASK-Lite-Chat-App.git

2. Install dependencies:

pip install -r requirements.txt

3. Run the application: 

python app.py

4. Access the app:

open your browser and navigate to http://localhost:5000


API Endpoints---

GET /users: Fetch all registered users.

POST /users: Register a new user.

GET /messages: Retrieve all chat history with joined user data.

POST /send: Send a new message.

DELETE /deletemsg: Delete a specific message by ID

DELETE /deleteuser: Remove a user and all their associated messages.


LICENSE---

This project is open-source and available for educational use.


Author note---

The app is currently configured to run on port 5000 by default but it is already ready to deploy and even i deployed this app.