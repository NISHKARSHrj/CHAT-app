let currentUserId = null;
let currentUserName = null;

async function createUser() {
    let name = document.getElementById("username").value.trim();
    if (!name) return alert("Please enter your name!");

    let res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name })
    });

    let data = await res.json();
    currentUserId = data.id;
    currentUserName = data.name;

    document.getElementById("username").value = "";
    document.getElementById("username").placeholder = "Joined as " + name;
    document.querySelector(".user-setup button").textContent = "Joined!";
    document.querySelector(".user-setup button").disabled = true;
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
        let div = document.createElement("div");
        div.className = "bubble " + (msg.user_id == currentUserId ? "me" : "other");

        let time = new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        div.innerHTML = `
            <div class="sender">${msg.user}</div>
            <div>${msg.text}</div>
            <div class="time">${time}</div>
        `;
        box.appendChild(div);
    });

    box.scrollTop = box.scrollHeight;
}

async function sendMessage() {
    if (!currentUserId) return alert("Please join first!");

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

setInterval(loadMessages, 2000);
loadMessages();