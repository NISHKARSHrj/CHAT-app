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

setInterval(loadMessages, 2000);
loadUsers();
loadMessages();