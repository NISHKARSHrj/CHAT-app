const API = "";
let currentUserId = null;
currentUserId = data.id;
// LOAD MESSAGES
async function loadMessages() {
let res = await fetch("/messages");
let data = await res.json();


let box = document.getElementById("messages");
box.innerHTML = "";

data.forEach(msg => {
    let div = document.createElement("div");
    div.className = "message";

    div.innerHTML = `<b>${msg.user}:</b> ${msg.text}`;

    box.appendChild(div);
});


}

// SEND MESSAGE
async function sendMessage() {
let input = document.getElementById("messageInput");
let text = input.value;


await fetch("/send", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        user_id: 1,
        text: text
    })
});

input.value = "";
loadMessages();


}

async function createUser() {
    let name = document.getElementById("username").value;

    let res = await fetch("/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: name})
    });

    let data = await res.json();

    // ⚠️ TEMP FIX: assume last user id
    currentUserId = 1; // we’ll fix this next

    alert("User set: " + name);
}

async function sendMessage() {
    let input = document.getElementById("messageInput");
    let text = input.value;

    await fetch("/send", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            user_id: currentUserId,
            text: text
        })
    });

    input.value = "";
    loadMessages();
}
// AUTO REFRESH
setInterval(loadMessages, 2000);

// INITIAL LOAD
loadMessages();
