let currentUserId = null;
let currentUserName = null;

async function loadUsers() {
    let res = await fetch("/users");
    let data = await res.json();
    let select = document.getElementById("userSelect");
    select.innerHTML = '<option value="">Select user...</option>';
    data.forEach(user => {
        let opt = document.createElement("option");
        opt.value = user.id;
        opt.textContent = user.name;
        select.appendChild(opt);
    });
}

function selectExistingUser() {
    let select = document.getElementById("userSelect");
    let selectedId = select.value;
    let selectedName = select.options[select.selectedIndex].text;
    if (!selectedId) return;
    currentUserId = selectedId;
    currentUserName = selectedName;
    showJoinedBar(selectedName);
}

function showSignup() {
    document.getElementById("signup-bar").style.display = "flex";
}

function hideSignup() {
    document.getElementById("signup-bar").style.display = "none";
    document.getElementById("newUsername").value = "";
}

function showJoinedBar(name) {
    document.getElementById("joined-bar").style.display = "block";
    document.getElementById("joined-label").textContent = "Chatting as " + name;
    hideSignup();
}

async function createUser() {
    let name = document.getElementById("newUsername").value.trim();
    if (!name) return alert("Please enter your name!");

    let res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
    });

    let data = await res.json();
    currentUserId = data.id;
    currentUserName = data.name;

    await loadUsers();
    document.getElementById("userSelect").value = data.id;
    showJoinedBar(data.name);
}

async function deleteMessage(msgId) {
    if (!confirm("Delete this message?")) return;

    let res = await fetch("/deletemsg", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ msg_id: msgId })
    });

    if (res.ok) {
        loadMessages();
    } else {
        alert("Could not delete message!");
    }
}

async function loadMessages() {
    let res = await fetch("/messages");
    let data = await res.json();
    let box = document.getElementById("messages");

    if (data.length === 0) {
        box.innerHTML = '<p class="no-messages">No messages yet. Say hello!</p>';
        return;
    }

    box.innerHTML = "";
    data.reverse().forEach(msg => {
        let wrap = document.createElement("div");
        wrap.className = "bubble-wrap " + (msg.user_id == currentUserId ? "me" : "other");

        let div = document.createElement("div");
        div.className = "bubble " + (msg.user_id == currentUserId ? "me" : "other");

        let time = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        div.innerHTML = `
            <div class="sender">${msg.user}</div>
            <div>${msg.text}</div>
            <div class="time">${time}</div>
        `;

        // show delete button only for your own messages
        let deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "&#x2715;";
        deleteBtn.title = "Delete message";

        if (msg.user_id == currentUserId) {
            deleteBtn.onclick = () => deleteMessage(msg.id);
            wrap.appendChild(div);
            wrap.appendChild(deleteBtn);
        } else {
            wrap.appendChild(div);
        }

        box.appendChild(wrap);
    });

    box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
    if (!currentUserId) return alert("Please select or create a user first!");

    let input = document.getElementById("messageInput");
    let text = input.value.trim();
    if (!text) return;

    await fetch("/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUserId, text: text })
    });

    input.value = "";
    loadMessages();
}


async function deleteUser() {
    if (!currentUserId) return;
    
    
    const confirmed = confirm(
        `WARNING: This will delete user "${currentUserName}" and ALL their messages!\n\n` +
        `This action cannot be undone. Are you absolutely sure?`
    );
    
    if (!confirmed) return;
    
    try {
        let res = await fetch("/deleteuser", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: currentUserId })
        });
        
        if (res.ok) {
            alert("User and all messages deleted successfully!");
            
        
            currentUserId = null;
            currentUserName = null;
            
            
            document.getElementById("joined-bar").style.display = "none";
            document.getElementById("deleteUserBtn").style.display = "none";
            
            
            await loadUsers();
            
            
            document.getElementById("messages").innerHTML = '<p class="no-messages">User deleted. Select or create a new user to chat.</p>';
        } else {
            let error = await res.json();
            alert("Error: " + (error.error || "Could not delete user"));
        }
    } catch (error) {
        console.error("Delete user error:", error);
        alert("Network error. Please try again.");
    }
}

function showJoinedBar(name) {
    document.getElementById("joined-bar").style.display = "block";
    document.getElementById("joined-label").textContent = "Chatting as " + name;
    document.getElementById("deleteUserBtn").style.display = "inline-block";  // Show delete button
    hideSignup();
}

function selectExistingUser() {
    let select = document.getElementById("userSelect");
    let selectedId = select.value;
    let selectedName = select.options[select.selectedIndex].text;
    if (!selectedId) return;
    currentUserId = selectedId;
    currentUserName = selectedName;
    showJoinedBar(selectedName);
    loadMessages();  
}

async function deleteMessage(msgId) {
    // Create custom styled confirmation
    const confirmed = confirm("Delete this message?");
    if (!confirmed) return;
    
    try {
        let res = await fetch("/deletemsg", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ msg_id: msgId })
        });
        
        if (res.ok) {
            loadMessages();

            showTempNotification("Message deleted");
        } else {
            let error = await res.json();
            alert("Could not delete message: " + (error.error || "Unknown error"));
        }
    } catch (error) {
        console.error("Delete message error:", error);
        alert("Network error. Please try again.");
    }
}


function showTempNotification(message) {
    let notif = document.createElement("div");
    notif.textContent = message;
    notif.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 12px;
        z-index: 1000;
        animation: fadeOut 2s ease-out;
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; visibility: hidden; }
    }
`;
document.head.appendChild(style);

setInterval(loadMessages, 2000);
loadUsers();
loadMessages();