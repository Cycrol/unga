function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem("ssip_users")) || [];
  } catch (err) {
    console.error("Failed to parse users", err);
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("ssip_users", JSON.stringify(users));
}

function getLoggedUser() {
  return localStorage.getItem("ssip_logged_in_user") || null;
}

function setLoggedUser(username) {
  localStorage.setItem("ssip_logged_in", "true");
  localStorage.setItem("ssip_logged_in_user", username);
}

function logoutUser() {
  localStorage.removeItem("ssip_logged_in");
  localStorage.removeItem("ssip_logged_in_user");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("Form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
      alert("Fill out all fields!");
      return;
    }

    const users = loadUsers();

    const exists = users.some(u => u.username === username || u.email === email);
    if (exists) {
      alert("An account with this username or email already exists.");
      return;
    }

    users.push({ username, email, password });
    saveUsers(users);

    alert(`Account created successfully: ${username}`);
    document.getElementById("password").value = "";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const identifier = document.getElementById("login_identifier").value.trim();
    const password = document.getElementById("login_password").value;
    const message = document.getElementById("login_message");

    const users = loadUsers();

    const user = users.find(
      u => (u.username === identifier || u.email === identifier) && u.password === password
    );

    if (!user) {
      message.style.color = "red";
      message.textContent = "Invalid username/email or password.";
      return;
    }

    setLoggedUser(user.username);

    message.style.color = "green";
    message.textContent = `Welcome, ${user.username}! Redirecting...`;

    setTimeout(() => {
      window.location.href = "account_homepage.html";
    }, 600);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const welcome = document.getElementById("welcome_area");
  const signout = document.getElementById("signout_btn");

  if (!welcome || !signout) return;

  const loggedIn = localStorage.getItem("ssip_logged_in") === "true";
  const user = getLoggedUser();

  if (!loggedIn || !user) {
    welcome.style.color = "red";
    welcome.textContent = "You are not logged in. Redirecting...";
    setTimeout(() => (window.location.href = "index.html"), 1000);
    return;
  }

  welcome.textContent = `Hello, ${user}! You are logged in.`;

  signout.addEventListener("click", () => {
    logoutUser();
    window.location.href = "index.html";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat_room");
  const chatArea = document.getElementById("chat_area");
  const chatInput = document.getElementById("chat_input");

  if (!chatArea || !chatForm || !chatInput) return;

  const MESSAGES_KEY = "ssip_messages";

  function loadMessages() {
    try {
      return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveMessages(msgs) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
  }

  function renderMessages() {
    const messages = loadMessages();
    chatArea.innerHTML = "";

    if (!messages.length) {
      chatArea.innerHTML = '<div style="color:#666">No messages yet.</div>';
      return;
    }

    const loggedUser = getLoggedUser();

    messages.forEach(msg => {
      const wrap = document.createElement("div");
      wrap.style.padding = "6px 8px";
      wrap.style.marginBottom = "6px";
      wrap.style.borderRadius = "6px";
      wrap.style.background = msg.user === loggedUser ? "#e6ffe6" : "#fff";

      const meta = document.createElement("div");
      meta.style.fontSize = "12px";
      meta.textContent = `${msg.user} • ${new Date(msg.ts).toLocaleString()}`;

      const text = document.createElement("div");
      text.textContent = msg.text;
      text.style.marginTop = "4px";

      wrap.appendChild(meta);
      wrap.appendChild(text);

      if (msg.user === loggedUser) {
        const btn = document.createElement("button");
        btn.textContent = "Delete";
        btn.style.marginLeft = "8px";
        btn.style.fontSize = "12px";
        btn.addEventListener("click", () => deleteMessage(msg.ts));
        meta.appendChild(btn);
      }

      chatArea.appendChild(wrap);
    });

    chatArea.scrollTop = chatArea.scrollHeight;
  }

  function deleteMessage(ts) {
    let messages = loadMessages();
    messages = messages.filter(m => m.ts !== ts);
    saveMessages(messages);
    renderMessages();
  }

  if (!localStorage.getItem("ssip_logged_in")) {
    chatInput.disabled = true;
    chatInput.placeholder = "Log in to chat";
    chatForm.querySelector("button").disabled = true;
  }

  renderMessages();

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!localStorage.getItem("ssip_logged_in")) {
      alert("You must be logged in.");
      return;
    }

    const text = chatInput.value.trim();
    if (!text) return;

    const newMsg = {
      user: getLoggedUser(),
      text,
      ts: Date.now()
    };

    const messages = loadMessages();
    messages.push(newMsg);
    saveMessages(messages);

    chatInput.value = "";
    renderMessages();
  });
});

if (username =="asd" || username =="thoh"){
	console.log(Date);
}
